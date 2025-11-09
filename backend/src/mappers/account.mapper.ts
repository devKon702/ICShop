import { Account, Role, User } from "@prisma/client";
import { PublicUser, toPublicUser } from "./user.mapper";

export type PublicAccount = {
  id: number;
  email: string;
  role: Role;
  user?: PublicUser;
};

export function toPublicAccount(
  account: Account & { user?: User }
): PublicAccount {
  return {
    id: account.id,
    email: account.email,
    role: account.role,
    user: account.user ? toPublicUser(account.user) : undefined,
  };
}
