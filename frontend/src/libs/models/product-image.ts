import { Product } from "@/libs/models/product";

export type ProductImage = {
  id: number;
  productId: number;
  imageUrl: string;
  product?: Product;
};
