import { Account } from "@/libs/models/account";

export type Role = {
  id: string;
  accounts?: Account[];
};
