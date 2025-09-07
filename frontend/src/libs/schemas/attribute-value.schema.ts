import { z } from "zod";
import {
  ID,
  UnsignedInt,
  Text,
  DateTimeSchema,
} from "../schemas/shared.schema";

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
