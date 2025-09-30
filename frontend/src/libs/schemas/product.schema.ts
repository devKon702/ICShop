import { z } from "zod";
import {
  ID,
  UnsignedInt,
  Text,
  Slug,
  DateTimeSchema,
  DecimalString,
} from "../schemas/shared.schema";
import { CategoryBaseSchema, CategorySchema } from "./category.schema";
import { WholesaleSchema } from "./wholesale.schema";
import { ProductImageBaseSchema } from "./product-image.schema";
import { ProductHighlightSchema } from "./product-highlight.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";

export const ProductBaseSchema = z.object({
  id: ID,
  name: Text,
  posterUrl: z.string().nullable().optional(),
  categoryId: UnsignedInt,
  datasheetLink: z.string().nullable().optional(),
  slug: Slug,
  desc: z.string().nullable().optional(),
  weight: UnsignedInt,
  price: DecimalString,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
  isActive: z.boolean(),
});

export const ProductSchema = ProductBaseSchema.extend({
  category: CategorySchema.optional(),
  wholesale: WholesaleSchema.nullable().optional(),
  images: z.array(ProductImageBaseSchema).optional(),
  highlights: z.array(ProductHighlightSchema).optional(),
});
export type Product = z.infer<typeof ProductSchema>;

export const FilterProductSchema = ProductBaseSchema.extend({
  creator: UserBaseSchema,
  modifier: UserBaseSchema,
  category: CategoryBaseSchema,
});

export const SafeProduct = ProductBaseSchema.omit({
  creatorId: true,
  modifierId: true,
  createdAt: true,
  updatedAt: true,
  version: true,
  isActive: true,
});
