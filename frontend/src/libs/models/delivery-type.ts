import { Order } from "@/libs/models/order";

export type DeliveryType = {
  type: string;
  name: string;
  orders?: Order[];
};
