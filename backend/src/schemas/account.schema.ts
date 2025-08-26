import { resourceLimits } from "worker_threads";
import { z } from "zod";
import { Role } from "../constants/db";

export const changePasswordSchema = z.object({
  body: z
    .object({
      oldPassword: z.string(),
      newPassword: z.string().min(6, "Mật khẩu tối thiểu 6 kí tự"),
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      message: "Mật khẩu mới phải khác mật khẩu cũ",
      path: ["newPassword"],
    }),
});

export type ChangePasswordIType = z.infer<typeof changePasswordSchema>;

export const getAccountInfoSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
});

export type GetAccountInfoIType = z.infer<typeof getAccountInfoSchema>;

export const filterAccountSchema = z.object({
  query: z.object({
    email: z
      .string()
      .transform((val) => (val.trim() ? val : undefined))
      .optional(),
    name: z
      .string()
      .transform((val) => (val.trim() ? val : undefined))
      .optional(),
    page: z.coerce.number().min(1, "Số trang phải lớn hơn 0"),
    limit: z.coerce.number().min(1, "SỐ lượng phải lớn hơn 0"),
    role: z.enum([Role.ADMIN, Role.USER]).default(Role.USER),
  }),
});

export type FilterAccountIType = z.infer<typeof filterAccountSchema>;

export const lockAccountSchema = z.object({
  body: z.object({
    accountId: z.coerce.number(),
    isActive: z.boolean(),
  }),
});

export type LockAccountIType = z.infer<typeof lockAccountSchema>;
