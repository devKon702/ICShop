import { z } from "zod";
import {
  ID,
  UnsignedInt,
  TinyText,
  DateTimeSchema,
} from "../schemas/shared.schema";
import { AddressBaseSchema } from "./address.schema";

export const UserBaseSchema = z.object({
  id: ID,
  accountId: UnsignedInt,
  name: TinyText,
  avatarUrl: z.string().nullable(),
  phone: z.string().nullable(),
  version: z.number().int(),
  creatorId: UnsignedInt.nullable(),
  modifierId: UnsignedInt.nullable(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const UserSchema = UserBaseSchema.extend({
  // account: AccountSchema.optional(),
  addresses: z.array(AddressBaseSchema).optional(),
  // lược bỏ các quan hệ "Createds/Modifieds" để tránh vòng import và dư thừa payload
});
export type User = z.infer<typeof UserSchema>;
