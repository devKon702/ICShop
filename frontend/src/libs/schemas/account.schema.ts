import { z } from "zod";
import { ID, DateTimeSchema } from "../schemas/shared.schema";
import { RoleEnum } from "../schemas/shared.schema";

export const AccountBaseSchema = z.object({
  id: ID,
  email: z.string().email(),
  role: RoleEnum,
  provider: z.string(),
  emailVerified: z.boolean(),
  isActive: z.boolean(),
  version: z.number().int(),
  creatorId: z.number().int().nonnegative().nullable(),
  modifierId: z.number().int().nonnegative().nullable(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const AccountSchema = AccountBaseSchema;
