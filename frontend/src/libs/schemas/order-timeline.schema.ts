import { z } from "zod";
import {
  ID,
  UnsignedInt,
  TinyInt,
  DateTimeSchema,
  Text,
} from "../schemas/shared.schema";

export const OrderTimelineSchema = z.object({
  id: ID,
  orderId: UnsignedInt,
  status: TinyInt, // 0..5 theo mô tả
  isRead: z.boolean(),
  desc: Text,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export type OrderTimeline = z.infer<typeof OrderTimelineSchema>;
