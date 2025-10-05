"use client";
import ClampText from "@/components/common/clamp-text";
import Counter from "@/components/common/counter";
import SafeImage from "@/components/common/safe-image";
import env from "@/constants/env";
import { ROUTE } from "@/constants/routes";
import cartService from "@/libs/services/cart.service";
import { useCartActions, useSelectedProducts } from "@/store/cart-store";
import { formatPrice, getUnitPrice } from "@/utils/price";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

interface CartItemProps {
  cartId: number;
  product: {
    id: number;
    name: string;
    posterUrl: string;
    slug: string;
    wholesale: {
      unit: string;
      vat: string;
      max_quantity: number;
      min_quantity: number;
      quantity_step: number;
      details: { min: number; price: string; desc: string }[];
    };
    quantity: number;
  };
}

export default function CartItem({ cartId, product }: CartItemProps) {
  const { removeItem, updateItem, selectProduct, unselectProduct } =
    useCartActions();
  const selectedProducts = useSelectedProducts();
  const queryClient = useQueryClient();
  const { mutate: deleteCartItem } = useMutation({
    mutationFn: async () => cartService.deleteMulti([cartId]),
    onSuccess: () => {
      toast.success("Xoá sản phẩm khỏi giỏ hàng thành công");
      removeItem(cartId);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast.error("Xoá sản phẩm khỏi giỏ hàng thất bại");
      console.log(error);
    },
  });
  return (
    <div className="flex items-center justify-between space-x-6 p-2 border-b-2 hover:bg-primary-light rounded-sm">
      <div className="flex-1 flex items-center space-x-5">
        <div
          className="size-5 border rounded-full cursor-pointer bg-white border-primary data-[checked=true]:bg-primary shrink-0"
          data-checked={selectedProducts.some((p) => p.cartId === cartId)}
          onClick={() => {
            if (selectedProducts.some((p) => p.cartId === cartId)) {
              console.log("unselect");
              unselectProduct(cartId);
            } else {
              console.log("select");
              selectProduct({
                id: product.id,
                name: product.name,
                posterUrl: product.posterUrl,
                cartId: cartId,
                wholesale: {
                  vat: product.wholesale.vat,
                  details: product.wholesale.details.map((item) => ({
                    min: item.min,
                    price: item.price,
                  })),
                  unit: product.wholesale.unit,
                },
                quantity: product.quantity,
              });
            }
          }}
        ></div>
        <Link
          href={`${ROUTE.product}/${product.slug}`}
          className="flex space-x-2"
          target="_blank"
        >
          <SafeImage
            src={`${env.NEXT_PUBLIC_FILE_URL}/${product.posterUrl}`}
            alt={product.name}
            width={200}
            height={300}
            className="size-20 object-cover"
          />
          <div className="flex flex-col hover:underline justify-center">
            <ClampText className="font-medium" lines={2} text={product.name} />
          </div>
        </Link>
      </div>
      <table className="w-fit">
        <tbody>
          {product.wholesale.details.map((detail, index) => (
            <tr key={index}>
              <td className="text-right pr-2 align-middle">{detail.desc}</td>
              <td className="text-right pl-2 align-middle">
                {formatPrice(Number(detail.price))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="" onClick={(e) => e.stopPropagation()}>
        <Counter
          min={product.wholesale.min_quantity}
          max={product.wholesale.max_quantity}
          value={product.quantity}
          step={product.wholesale.quantity_step}
          onDownClick={(e) => {
            e.stopPropagation();
            updateItem(
              cartId,
              Math.max(
                product.wholesale.min_quantity,
                product.quantity - product.wholesale.quantity_step
              )
            );
          }}
          onUpClick={(e) => {
            e.stopPropagation();
            updateItem(
              cartId,
              Math.min(
                product.wholesale.max_quantity,
                product.quantity + product.wholesale.quantity_step
              )
            );
          }}
          onInputChange={(e) => {
            e.stopPropagation();
            updateItem(
              cartId,
              Math.max(
                product.wholesale.min_quantity,
                Math.min(product.wholesale.max_quantity, +e.target.value)
              )
            );
          }}
        ></Counter>
      </div>
      <div className="flex flex-col min-w-24">
        <span className="font-semi opacity-50 text-sm">
          {`${formatPrice(
            getUnitPrice(product.quantity, product.wholesale.details)
          )} / ${product.wholesale.unit}`}
        </span>
        <span className="font-bold text-xl">
          {formatPrice(
            getUnitPrice(product.quantity, product.wholesale.details) *
              product.quantity
          )}
        </span>
      </div>
      <Trash
        className="p-1 text-red-400 rounded-full hover:bg-red-400/10 cursor-pointer"
        onClick={() => {
          if (confirm("Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?"))
            deleteCartItem();
        }}
      />
    </div>
  );
}
