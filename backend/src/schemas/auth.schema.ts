import { z } from "zod";
import { emailRegex, phoneRegex, vietnameseRegex } from "../utils/regex";
import { requestSchema } from "./shared.schema";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export type LoginIType = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  body: z.object({
    name: z
      .string()
      .max(100, "Tên dài tối đa 100 kí tự")
      .refine((val) => vietnameseRegex().test(val) || emailRegex().test(val), {
        message: "Tên chỉ gồm kí tự tiếng Việt hoặc email",
      }),
    email: z.string().email(),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 kí tự"),
    phone: z
      .string()
      .regex(
        phoneRegex(),
        "Số điện thoại không hợp lệ theo định dạng Việt Nam."
      ),
  }),
});

export const sendEmailOTPSchema = requestSchema({
  body: z.object({
    email: z.string().trim().email("Email không hợp lệ"),
  }),
});

export type SignupIType = z.infer<typeof signupSchema>;
