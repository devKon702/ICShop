import { z } from "zod";
import {
  ID,
  UnsignedInt,
  Text,
  DateTimeSchema,
} from "../schemas/shared.schema";
import { AttributeValueBaseSchema } from "@/libs/schemas/attribute-value.schema";

export const AttributeBaseSchema = z.object({
  id: ID,
  name: Text,
  categoryId: UnsignedInt,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const AttributeWithValuesSchema = AttributeBaseSchema.extend({
  values: z.array(AttributeValueBaseSchema),
});

export const AttributeSchema = AttributeBaseSchema;
export type Attribute = z.infer<typeof AttributeSchema>;

export const CreateAttributeSchema = AttributeBaseSchema;

export const GetAttributeListWithValues = z.array(
  AttributeBaseSchema.extend({ values: z.array(AttributeValueBaseSchema) })
);
