import { z } from "zod";
import { ID, UnsignedInt, DateTimeSchema } from "../schemas/shared.schema";

export const ProductImageBaseSchema = z.object({
  id: ID,
  productId: UnsignedInt,
  imageUrl: z.string(),
  position: UnsignedInt,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export type ProductImage = z.infer<typeof ProductImageBaseSchema>;

export const SafeProductImageSchema = ProductImageBaseSchema.omit({
  creatorId: true,
  modifierId: true,
  createdAt: true,
  updatedAt: true,
  version: true,
});
