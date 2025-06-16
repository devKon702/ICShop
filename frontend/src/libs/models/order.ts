import { DeliveryType } from "@/libs/models/delivery-type";
import { OrderDetail } from "@/libs/models/order-detail";
import { OrderStatus } from "@/libs/models/order-status";
import { OrderTimeline } from "@/libs/models/order-timeline";
import { User } from "@/libs/models/user";

export type Order = {
  id: string;
  userId: number;
  orderStatusId: number;
  address: string;
  receiverName: string;
  receiverPhone: string;
  deliveryTypeId: string;
  vat: number;
  deliveryFee: number;
  earliestReceiveTime: string;
  latestReceiveTime: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  orderStatus?: OrderStatus;
  deliveryType?: DeliveryType;
  details?: OrderDetail[];
  timelines?: OrderTimeline[];
};
