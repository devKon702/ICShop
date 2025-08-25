import { z } from "zod";
import { vietnameseRegex } from "../utils/regex";

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
});

export const getCategoryByIdSchema = z.object({
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});
