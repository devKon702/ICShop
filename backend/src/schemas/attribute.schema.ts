import { z } from "zod";
import { vietnameseRegex } from "../utils/regex";

export const createAttributeSchema = z.object({
  body: z.object({
    name: z
      .string()
      .nonempty()
      .regex(vietnameseRegex(false), "Tên chỉ bao gồm khoảng trắng và chữ cái"),
    categoryId: z.number(),
  }),
});

export const updateAttributeSchema = z.object({
  body: z.object({
    name: z
      .string()
      .nonempty()
      .regex(vietnameseRegex(false), "Tên chỉ bao gồm khoảng trắng và chữ cái"),
  }),
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});

export const deleteAttributeSchema = z.object({
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});
