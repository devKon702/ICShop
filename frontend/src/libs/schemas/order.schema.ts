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
import { OrderDetailSchema } from "./order-detail.schema";
import { OrderTimelineSchema } from "./order-timeline.schema";

export const OrderBaseSchema = z.object({
  id: ID,
  code: z.string().min(1),
  userId: UnsignedInt,
  status: TinyInt,
  province: TinyText,
  district: TinyText,
  commune: TinyText,
  detail: Text,
  receiverName: TinyText,
  receiverPhone: z.string().min(3).max(20),
  deliveryType: TinyInt, // 1|2
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

export const OrderSchema = OrderBaseSchema.extend({
  details: z.array(OrderDetailSchema).optional(),
  timelines: z.array(OrderTimelineSchema).optional(),
});
export type Order = z.infer<typeof OrderSchema>;
