import { z } from "zod";
import {
  ID,
  UnsignedInt,
  DecimalString,
  DateTimeSchema,
  TinyText,
} from "../schemas/shared.schema";

export const OrderDetailSchema = z.object({
  id: ID,
  orderId: UnsignedInt,
  productId: UnsignedInt,
  quantity: UnsignedInt,
  unitPrice: DecimalString,
  unit: TinyText,
  vat: DecimalString,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const SafeOrderDetailSchema = OrderDetailSchema.omit({
  creatorId: true,
  modifierId: true,
  version: true,
  createdAt: true,
  updatedAt: true,
});

export type OrderDetail = z.infer<typeof OrderDetailSchema>;
