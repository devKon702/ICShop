import { Account } from "@/libs/models/account";
import { Address } from "@/libs/models/address";
import { CartDetail } from "@/libs/models/cart-detail";
import { Order } from "@/libs/models/order";
import { OrderTimeline } from "@/libs/models/order-timeline";

export type User = {
  id: number;
  accountId: number;
  name: string;
  avatarUrl?: string;
  updatedAt: string;
  account?: Account;
  orderTimelines?: OrderTimeline[];
  addresses?: Address[];
  orders?: Order[];
  cartDetails?: CartDetail[];
};
