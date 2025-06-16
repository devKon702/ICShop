import { Product } from "@/libs/models/product";
import { User } from "@/libs/models/user";

export type CartDetail = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  product?: Product;
};
