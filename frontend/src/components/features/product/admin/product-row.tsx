"use client";
import ClampText from "@/components/common/clamp-text";
import SafeImage from "@/components/common/safe-image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import env from "@/constants/env";
import { CategoryBaseSchema } from "@/libs/schemas/category.schema";
import { ProductBaseSchema } from "@/libs/schemas/product.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
import productService from "@/libs/services/product.service";
import { useModalActions } from "@/store/modal-store";
import { formatPrice } from "@/utils/price";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BringToFront, Check, Info, Pencil, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productSchema = ProductBaseSchema.extend({
  category: CategoryBaseSchema,
  creator: UserBaseSchema,
  modifier: UserBaseSchema,
});

interface Props {
  product: z.infer<typeof productSchema>;
}

export default function ProductRow({ product }: Props) {
  const { openModal, closeModal } = useModalActions();
  const queryClient = useQueryClient();
  const { mutate: deleteProductMutate } = useMutation({
    mutationFn: () => productService.admin.delete(product.id),
    onSuccess: () => {
      toast.success("Xóa thành công sản phẩm " + product.name);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutate: updateProductActive } = useMutation({
    mutationFn: (isActive: boolean) =>
      productService.admin.updateActive(product.id, isActive),
    onSuccess: ({ data }) => {
      toast.success(
        `${data.isActive ? "Kích hoạt" : "Ẩn"} sản phẩm thành công`
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["product", { id: product.id }],
      });
    },
  });
  return (
    <TableRow>
      <TableCell>
        <SafeImage
          key={`${env.NEXT_PUBLIC_FILE_URL}/${product.posterUrl}`}
          src={`${env.NEXT_PUBLIC_FILE_URL}/${product.posterUrl}`}
          alt="Poster"
          width={40}
          height={40}
        />
      </TableCell>
      <TableCell className="flex-1">
        <ClampText className="w-fit" lines={1} text={product.name} />
      </TableCell>
      <TableCell className="min-w-32">
        <ClampText className="w-fit" lines={1} text={product.category.name} />
      </TableCell>
      <TableCell>{formatPrice(Number(product.price))}đ</TableCell>
      <TableCell>
        {product.isActive ? (
          <Check
            className="p-1 rounded-full bg-primary text-white cursor-pointer mx-auto"
            onClick={() => {
              if (confirm("Xác nhận ẩn sản phẩm")) {
                updateProductActive(false);
              }
            }}
          />
        ) : (
          <Check
            className="p-1 rounded-full bg-gray-200 text-gray-400 cursor-pointer mx-auto"
            onClick={() => {
              if (confirm("Xác nhận kích hoạt sản phẩm")) {
                updateProductActive(true);
              }
            }}
          />
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2 justify-center items-center">
          <div
            className="cursor-pointer p-1 hover:bg-primary/10 rounded-md"
            onClick={() => {
              openModal({
                type: "updateProduct",
                props: { productId: product.id },
              });
            }}
          >
            <Pencil className="p-1" />
          </div>
          <div
            className="cursor-pointer p-1 hover:bg-red-600/10 rounded-md"
            onClick={() => {
              if (confirm("Xác nhận xóa sản phẩm " + product.name)) {
                deleteProductMutate();
              }
            }}
          >
            <Trash className="p-1 text-red-400" />
          </div>
          <div
            className="cursor-pointer p-1 hover:bg-gray-600/10 rounded-md"
            onClick={() => {
              openModal({
                type: "productDetail",
                props: { productId: product.id },
              });
            }}
          >
            <Info className="cursor-pointer p-1" />
          </div>
          <Popover>
            <PopoverTrigger>
              <div className="cursor-pointer p-1 hover:bg-gray-600/10 rounded-md">
                <BringToFront className="cursor-pointer p-1" />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div>Thêm vào nổi bật</div>
            </PopoverContent>
          </Popover>
        </div>
      </TableCell>
    </TableRow>
  );
}
