import { z } from "zod";
import {
  ID,
  UnsignedInt,
  TinyInt,
  DateTimeSchema,
  Text,
} from "../schemas/shared.schema";
import { OrderStatus } from "@/constants/enums";

export const OrderTimelineBaseSchema = z.object({
  id: ID,
  orderId: UnsignedInt,
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
  isRead: z.boolean(),
  desc: Text,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export type OrderTimeline = z.infer<typeof OrderTimelineBaseSchema>;
