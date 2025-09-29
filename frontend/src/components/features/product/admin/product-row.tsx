import ClampText from "@/components/common/clamp-text";
import SafeImage from "@/components/common/safe-image";
import { TableCell, TableRow } from "@/components/ui/table";
import env from "@/constants/env";
import { CategoryBaseSchema } from "@/libs/schemas/category.schema";
import { ProductBaseSchema } from "@/libs/schemas/product.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
import { formatPrice } from "@/utils/number";
import { Check, Info, Pencil, Trash } from "lucide-react";
import React from "react";
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
          <Check className="p-1 rounded-full bg-primary text-white" />
        ) : (
          <Check className="p-1 rounded-full bg-gray-200 text-gray-400" />
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2 justify-center items-center">
          <Pencil className="cursor-pointer p-1" />
          {/* <Info className="cursor-pointer p-1" /> */}
          <Trash className="cursor-pointer p-1 text-red-400 hover:text-red-600" />
          <Info className="cursor-pointer p-1" />
        </div>
      </TableCell>
    </TableRow>
  );
}
