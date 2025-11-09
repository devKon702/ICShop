import { Account, User } from "@prisma/client";
import { PublicAccount, toPublicAccount } from "./account.mapper";
import { ParseParams } from "zod";

export type PublicUser = {
  id: number;
  name: string | null;
  avatarUrl: string | null;
  phone: string | null;
  accountId: number;
  account?: PublicAccount;
};

export function toPublicUser(user: User & { account?: Account }): PublicUser {
  return {
    id: user.id,
    accountId: user.accountId,
    name: user.name,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    account: user.account ? toPublicAccount(user.account) : undefined,
  };
}
