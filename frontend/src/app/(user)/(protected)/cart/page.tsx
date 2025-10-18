"use client";
import SetBreadCrump from "@/components/common/set-breadcrump";
import CartHeader from "@/components/features/cart/cart-header";
import CartList from "@/components/features/cart/cart-list";
import CartSummary from "@/components/features/cart/cart-summary";
import { Skeleton } from "@/components/ui/skeleton";
import cartService from "@/libs/services/cart.service";
import { useCartActions, useCartItems } from "@/store/cart-store";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function CartPage() {
  const localCartItems = useCartItems();
  const { addItem } = useCartActions();
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () =>
      cartService.getCart().then((res) => {
        res.data.forEach((item) => {
          const localItem = localCartItems.find((i) => i.id === item.id);
          if (!localItem) {
            addItem(item.id, item.product.wholesale.min_quantity);
          }
        });
        return res;
      }),
  });
  return (
    <div className="grid grid-cols-12 space-x-3">
      <SetBreadCrump
        breadcrumps={[
          { label: "Trang chủ", href: "/" },
          { label: "Giỏ hàng", href: "/cart" },
        ]}
      ></SetBreadCrump>
      <div className="col-span-9 rounded-md bg-white p-2 shadow-md">
        <h1 className="font-medium text-2xl p-2">Giỏ hàng</h1>
        <CartHeader />
        {isLoading ? (
          <div>
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
        ) : (
          <CartList
            items={
              data?.data.map((item) => ({
                id: item.id,
                product: {
                  id: item.product.id,
                  name: item.product.name,
                  posterUrl: item.product.posterUrl || "",
                  slug: item.product.slug,
                  quantity:
                    localCartItems.find((i) => i.id === item.id)?.quantity ||
                    item.product.wholesale.min_quantity,
                  wholesale: {
                    vat: item.product.wholesale.vat,
                    details: item.product.wholesale.details,
                    max_quantity: item.product.wholesale.max_quantity,
                    min_quantity: item.product.wholesale.min_quantity,
                    step: item.product.wholesale.quantity_step,
                    unit: item.product.wholesale.unit,
                  },
                },
              })) || []
            }
          />
        )}
      </div>
      <div className="col-span-3 rounded-md bg-white px-2 py-4 h-fit shadow-md sticky top-5">
        <CartSummary />
      </div>
    </div>
  );
}
