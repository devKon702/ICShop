import { resourceLimits } from "worker_threads";
import { z } from "zod";
import { Role } from "../constants/db";
import { requestSchema } from "./shared.schema";

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string(),
      newPassword: z.string().min(6, "Mật khẩu tối thiểu 6 kí tự"),
    })
    .refine((data) => data.newPassword !== data.currentPassword, {
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
    phone: z.string().optional(),
    page: z.coerce.number().min(1, "Số trang phải lớn hơn 0").default(1),
    limit: z.coerce.number().min(1, "Số lượng phải lớn hơn 0").default(10),
    role: z.enum([Role.ADMIN, Role.USER]).default(Role.USER),
    sortBy: z
      .enum(["created-asc", "created-desc", "name-asc", "name-desc"])
      .default("created-desc"),
  }),
});

export type FilterAccountIType = z.infer<typeof filterAccountSchema>;

export const changeAccountStatusSchema = z.object({
  body: z.object({
    accountId: z.coerce.number(),
    isActive: z.boolean(),
  }),
});

export const sendUpdateUserEmailOtpSchema = requestSchema({
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
  }),
});

export const updateUserEmailSchema = requestSchema({
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
    otp: z.string().length(6, "Mã OTP gồm 6 ký tự"),
  }),
});

export const adminRequestChangeEmailSchema = requestSchema({
  body: z.object({
    password: z.string().nonempty(),
  }),
});

export const adminRejectChangeEmailSchema = requestSchema({
  body: z.object({
    token: z.string().nonempty(),
  }),
});

export const adminConfirmChangeEmailSchema = requestSchema({
  body: z.object({
    token: z.string().nonempty(),
    newEmail: z.string().email(),
    otp: z.string().nonempty(),
  }),
});

export const adminLockAccountSchema = requestSchema({
  body: z.object({
    token: z.string().nonempty(),
  }),
});

export const adminRequestChangePasswordSchema = requestSchema({
  body: z
    .object({
      oldPassword: z.string().nonempty(),
      newPassword: z.string().nonempty(),
    })
    .refine(
      (value) => value.oldPassword !== value.newPassword,
      "Mật khẩu mới không được giống với mật khẩu cũ",
    ),
});

export const adminConfirmChangePasswordSchema = requestSchema({
  body: z.object({
    token: z.string().nonempty(),
  }),
});
export type LockAccountIType = z.infer<typeof changeAccountStatusSchema>;
