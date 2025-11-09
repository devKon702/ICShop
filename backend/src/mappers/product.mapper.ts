import { Category, Product, Wholesale, WholesaleDetail } from "@prisma/client";
import { PublicCategory, toPublicCategory } from "./category.mapper";

export type PublicProduct = {
  id: number;
  name: string;
  posterUrl: string | null;
  categoryId: number;
  datasheetLink?: string | null;
  slug: string;
  desc: string | null;
  weight: number;
  price: string;
  category?: PublicCategory;
};

export function toPublicProduct(
  product: Product & {
    category?: Category;
    wholesale?: Wholesale & { details?: WholesaleDetail[] };
  }
): PublicProduct {
  return {
    id: product.id,
    name: product.name,
    posterUrl: product.posterUrl,
    categoryId: product.categoryId,
    datasheetLink: product.datasheetLink,
    slug: product.slug,
    desc: product.desc,
    weight: product.weight,
    price: product.price.toString(),
    category: product.category ? toPublicCategory(product.category) : undefined,
  };
}
