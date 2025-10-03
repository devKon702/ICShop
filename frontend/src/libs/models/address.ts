import { User } from "@/libs/models/user";

export type Address = {
  id: string;
  userId: number;
  alias: string;
  receiverName: string;
  receiverPhone: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
  user?: User;
};
