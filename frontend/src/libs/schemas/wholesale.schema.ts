import { z } from "zod";
import {
  ID,
  UnsignedInt,
  UnsignedTinyInt,
  TinyText,
  DateTimeSchema,
  DecimalString,
} from "../schemas/shared.schema";
import { WholesaleDetailBaseSchema } from "./wholesale-detail.schema";

export const WholesaleBaseSchema = z.object({
  id: ID,
  productId: UnsignedInt,
  min_quantity: UnsignedTinyInt,
  max_quantity: UnsignedInt,
  quanity_step: UnsignedTinyInt,
  unit: TinyText,
  vat: DecimalString,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const WholesaleSchema = WholesaleBaseSchema.extend({
  details: z.array(WholesaleDetailBaseSchema).optional(),
});
export type Wholesale = z.infer<typeof WholesaleSchema>;
