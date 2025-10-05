import { z } from "zod";
import {
  ID,
  UnsignedInt,
  DecimalString,
  DateTimeSchema,
} from "../schemas/shared.schema";

export const OrderDetailSchema = z.object({
  id: ID,
  orderId: UnsignedInt,
  productId: UnsignedInt,
  quantity: UnsignedInt,
  unitPrice: DecimalString,
  vat: DecimalString,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export type OrderDetail = z.infer<typeof OrderDetailSchema>;
