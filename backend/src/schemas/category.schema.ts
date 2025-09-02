import { z } from "zod";
import { vietnameseRegex } from "../utils/regex";
import { query } from "winston";

export const GetCategorySchema = z.object({
  slug: z.string(),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().max(100, "Tối đa 100 kí tự"),
    parentId: z.coerce.number().min(1, "ID không hợp lệ").optional(),
  }),
});

export const udpateCategorySchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    name: z.string().max(100, "Tối đa 100 kí tự"),
    parentId: z.coerce.number().min(1, "ID không hợp lệ").optional(),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});

export const getCategoryBySlugSchema = z.object({
  params: z.object({ slug: z.string().nonempty() }),
  query: z.object({
    vids: z
      .string()
      .nonempty()
      .trim()
      .transform((str) => str.split(",").map((item) => Number(item)))
      .refine((arr) => !arr.some((item) => isNaN(item)))
      .optional(),
    page: z.coerce
      .number()
      .transform((val) => (val <= 0 ? 1 : val))
      .default(1),
    limit: z.coerce
      .number()
      .transform((val) => (val <= 0 ? 10 : val))
      .default(10),
    order: z.enum(["price_asc", "price_desc"]).default("price_asc"),
  }),
});

export const getCategoryByIdSchema = z.object({
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});

export const getProductFromRootCategorySchema = z.object({
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});
