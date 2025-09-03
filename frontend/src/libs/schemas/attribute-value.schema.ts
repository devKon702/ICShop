import { z } from "zod";
import {
  ID,
  UnsignedInt,
  Text,
  DateTimeSchema,
} from "../schemas/shared.schema";
import { AttributeSchema } from "./attribute.schema";

export const AttributeValueBaseSchema = z.object({
  id: ID,
  attributeId: UnsignedInt,
  value: Text,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const AttributeValueSchema = AttributeValueBaseSchema.extend({
  attribute: AttributeSchema.optional(),
});
export type AttributeValue = z.infer<typeof AttributeValueSchema>;
