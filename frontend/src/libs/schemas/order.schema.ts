import { z } from "zod";
import {
  ID,
  UnsignedInt,
  TinyInt,
  TinyText,
  Text,
  DecimalString,
  DateTimeSchema,
} from "../schemas/shared.schema";
import { DeliveryType, OrderStatus } from "@/constants/enums";

export const OrderBaseSchema = z.object({
  id: ID,
  code: z.string().min(1),
  userId: UnsignedInt,
  status: TinyInt.refine((val) =>
    [
      OrderStatus.PENDING,
      OrderStatus.PAID,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPING,
      OrderStatus.DONE,
      OrderStatus.CANCELED,
    ].includes(val)
  ), // 1: Pending, 2: Paid, 3: Processing, 4: Shipping, 5: Done, 0: Canceled
  province: TinyText,
  district: TinyText,
  commune: TinyText,
  detail: Text,
  receiverName: TinyText,
  receiverPhone: z.string().min(3).max(20),
  deliveryType: TinyInt.refine((val) =>
    [DeliveryType.SHOP, DeliveryType.POST].includes(val)
  ), // 1: Shop, 2: Post
  deliveryFee: DecimalString,
  earliestReceiveTime: DateTimeSchema,
  latestReceiveTime: DateTimeSchema,
  total: DecimalString,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
