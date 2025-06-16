import { Order } from "@/libs/models/order";
import { OrderTimeline } from "@/libs/models/order-timeline";

export type OrderStatus = {
  id: number;
  name: string;
  orders?: Order[];
  orderTimelines?: OrderTimeline[];
};
