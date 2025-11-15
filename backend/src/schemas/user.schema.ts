import { z } from "zod";
import { emailRegex, phoneRegex, vietnameseRegex } from "../utils/regex";
import { requestSchema } from "./shared.schema";

export const updateUserSchema = requestSchema({
  body: z.object({
    name: z
      .string()
      .trim()
      .nonempty("Tên không được để trống")
      .max(100, "Tên dài tối đa 100 kí tự")
      .refine((val) => vietnameseRegex().test(val), {
        message: "Tên chỉ gồm kí tự tiếng Việt",
      })
      .optional(),
    phone: z
      .string()
      .regex(phoneRegex(), "Số điện thoại phải theo định dạng Việt Nam")
      .optional(),
  }),
});

export type UpdateUserIType = z.infer<typeof updateUserSchema>;
