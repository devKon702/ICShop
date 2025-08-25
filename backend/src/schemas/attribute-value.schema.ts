import { z } from "zod";
import { vietnameseRegex } from "../utils/regex";

export const createAttrValSchema = z.object({
  body: z.object({
    attributeId: z.number(),
    value: z
      .string()
      .nonempty()
      .regex(
        vietnameseRegex(true),
        "Giá trị bao gồm chữ cái, số và khoảng trắng"
      ),
  }),
});

export const updateAttrValSchema = z.object({
  body: z.object({
    value: z
      .string()
      .nonempty()
      .regex(
        vietnameseRegex(true),
        "Giá trị bao gồm chữ cái, số và khoảng trắng"
      ),
  }),
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});

export const deleteAttrValSchema = z.object({
  params: z.object({
    id: z.coerce.number().min(1, "ID không hợp lệ"),
  }),
});
