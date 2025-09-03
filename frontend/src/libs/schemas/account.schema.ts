import { z } from "zod";
import { ID, DateTimeSchema } from "../schemas/shared.schema";
import { RoleEnum } from "../schemas/shared.schema";

export const AccountBaseSchema = z.object({
  id: ID,
  email: z.string().email(),
  password: z.string().nullable().optional(),
  role: RoleEnum,
  isGoogleSigned: z.boolean(),
  isEmailAuth: z.boolean(),
  isActive: z.boolean(),
  version: z.number().int(),
  creatorId: z.number().int().nonnegative().nullable().optional(),
  modifierId: z.number().int().nonnegative().nullable().optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const AccountSchema = AccountBaseSchema; // không embed User để tránh vòng
export type Account = z.infer<typeof AccountSchema>;
