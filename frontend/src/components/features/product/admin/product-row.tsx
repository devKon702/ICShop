"use client";
import ClampText from "@/components/common/clamp-text";
import SafeImage from "@/components/common/safe-image";
import { TableCell, TableRow } from "@/components/ui/table";
import env from "@/constants/env";
import { CategoryBaseSchema } from "@/libs/schemas/category.schema";
import { ProductBaseSchema } from "@/libs/schemas/product.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
import productService from "@/libs/services/product.service";
import { useModalActions } from "@/store/modal-store";
import { formatPrice } from "@/utils/price";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Info, Pencil, Trash } from "lucide-react";
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
  const { closeModal } = useModalActions();
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
    },
  });
  return (
    <TableRow>
      <TableCell>
        <SafeImage
          src={`${env.NEXT_PUBLIC_FILE_URL}/${product.posterUrl}`}
          alt="Poster"
          width={40}
          height={40}
        />
      </TableCell>
      <TableCell>
        <ClampText
          className="cursor-pointer hover:underline w-fit"
          lines={1}
          text={product.name}
        />
      </TableCell>
      <TableCell>{product.category.name}</TableCell>
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
          <Pencil className="cursor-pointer p-1" />
          {/* <Info className="cursor-pointer p-1" /> */}
          <Trash
            className="cursor-pointer p-1 text-red-400 hover:text-red-600"
            onClick={() => {
              if (confirm("Xác nhận xóa sản phẩm " + product.name)) {
                deleteProductMutate();
              }
            }}
          />
          <Info className="cursor-pointer p-1" />
        </div>
      </TableCell>
    </TableRow>
  );
}
