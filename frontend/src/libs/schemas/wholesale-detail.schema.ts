import { z } from "zod";
import {
  ID,
  UnsignedInt,
  TinyText,
  DecimalString,
  DateTimeSchema,
} from "../schemas/shared.schema";

export const WholesaleDetailBaseSchema = z.object({
  id: ID,
  wholesaleId: UnsignedInt,
  desc: TinyText,
  min: UnsignedInt,
  max: UnsignedInt.nullable().optional(),
  price: DecimalString,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export type WholesaleDetail = z.infer<typeof WholesaleDetailBaseSchema>;
