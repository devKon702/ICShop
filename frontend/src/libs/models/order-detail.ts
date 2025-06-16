import { Order } from "@/libs/models/order";
import { Product } from "@/libs/models/product";

export type OrderDetail = {
  id: string;
  orderId: string;
  productId: number;
  quantity: number;
  totalPrice: number;
  product?: Product;
  order?: Order;
};
