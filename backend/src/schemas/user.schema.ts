import { z } from "zod";
import { emailRegex, vietnameseRegex } from "../utils/regex";

export const updateUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .max(100, "Tên dài tối đa 100 kí tự")
      .refine((val) => vietnameseRegex().test(val) || emailRegex().test(val), {
        message: "Tên chỉ gồm kí tự tiếng Việt hoặc email",
      }),
  }),
});

export type UpdateUserIType = z.infer<typeof updateUserSchema>;
