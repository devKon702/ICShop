import { z } from "zod";
import { ID, UnsignedInt, DateTimeSchema } from "../schemas/shared.schema";

export const ProductAttributeBaseSchema = z.object({
  id: ID,
  productId: UnsignedInt,
  attributeValueId: UnsignedInt,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const SafeProductAttributeSchema = ProductAttributeBaseSchema.omit({
  creatorId: true,
  modifierId: true,
  createdAt: true,
  updatedAt: true,
  version: true,
});
