import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export type LoginType = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 kí tự"),
  }),
});

export type SignupType = z.infer<typeof signupSchema>;
