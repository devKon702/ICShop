import {
  AccountBaseSchema,
  AccountSchema,
} from "@/libs/schemas/account.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
import { z } from "zod";

export const LoginSchema = z.object({
  account: AccountSchema.pick({
    email: true,
    id: true,
    isActive: true,
    role: true,
    isGoogleSigned: true,
    isEmailAuth: true,
  }).extend({ user: UserBaseSchema.omit({ accountId: true }) }),
  token: z.string(),
});

export const SignupSchema = AccountBaseSchema.extend({
  user: UserBaseSchema,
});

export const RefreshSchema = z.object({
  token: z.string(),
});
