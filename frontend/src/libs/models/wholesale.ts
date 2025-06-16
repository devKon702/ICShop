import { Product } from "@/libs/models/product";
import { WholesaleDetail } from "@/libs/models/wholesale-detail";

export type Wholesale = {
  id: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
  details?: WholesaleDetail[];
  product?: Product;
  isActiveFor?: Product;
};
