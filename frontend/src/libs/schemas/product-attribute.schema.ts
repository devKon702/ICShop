import { z } from "zod";
import { ID, UnsignedInt, DateTimeSchema } from "../schemas/shared.schema";
import { AttributeValueSchema } from "./attribute-value.schema";

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

export const ProductAttributeSchema = ProductAttributeBaseSchema.extend({
  attributeValue: AttributeValueSchema.optional(),
  // tránh embed product để không tạo vòng import (Product -> ProductAttribute -> Product)
});
export type ProductAttribute = z.infer<typeof ProductAttributeSchema>;
