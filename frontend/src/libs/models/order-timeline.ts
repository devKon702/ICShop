import { Order } from "@/libs/models/order";
import { OrderStatus } from "@/libs/models/order-status";
import { User } from "@/libs/models/user";

export type OrderTimeline = {
  id: string;
  orderId: string;
  orderStatusId: number;
  userId: number;
  desc: string;
  createdAt: string;
  user?: User;
  order?: Order;
  orderStatus?: OrderStatus;
};
