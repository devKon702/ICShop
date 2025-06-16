import { Attribute } from "@/libs/models/attribute";
import { Product } from "@/libs/models/product";

export type Category = {
  id: number;
  name: string;
  imageUrl?: string;
  parentId?: number;
  level: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  parent?: Category;
  children?: Category[];
  products?: Product[];
  attributes?: Attribute[];
};
