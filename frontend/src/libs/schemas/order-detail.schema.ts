import { z } from "zod";
import {
  ID,
  UnsignedInt,
  DecimalString,
  TinyInt,
  DateTimeSchema,
} from "../schemas/shared.schema";

export const OrderDetailSchema = z.object({
  id: ID,
  orderId: UnsignedInt,
  productId: UnsignedInt,
  quantity: UnsignedInt,
  unitPrice: DecimalString,
  vat: TinyInt, // 0-100, nếu muốn siết: .min(0).max(100)
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export type OrderDetail = z.infer<typeof OrderDetailSchema>;
