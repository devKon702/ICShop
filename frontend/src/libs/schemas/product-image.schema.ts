import { z } from "zod";
import {
  ID,
  UnsignedInt,
  UrlString,
  DateTimeSchema,
} from "../schemas/shared.schema";

export const ProductImageSchema = z.object({
  id: ID,
  productId: UnsignedInt,
  imageUrl: UrlString,
  position: UnsignedInt,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export type ProductImage = z.infer<typeof ProductImageSchema>;
