import {
  DateTimeSchema,
  TinyInt,
  UnsignedInt,
} from "@/libs/schemas/shared.schema";
import { z } from "zod";

export const LocationBaseSchema = z.object({
  id: UnsignedInt,
  name: z.string(),
  type: TinyInt, // 1: Province, 2: District, 3: Ward
  parentId: UnsignedInt.nullable(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
