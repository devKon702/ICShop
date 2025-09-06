import { z } from "zod";
import {
  ID,
  UnsignedInt,
  Text,
  DateTimeSchema,
} from "../schemas/shared.schema";

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

export const AttributeSchema = AttributeBaseSchema;
export type Attribute = z.infer<typeof AttributeSchema>;

export const CreateAttributeSchema = AttributeBaseSchema;
