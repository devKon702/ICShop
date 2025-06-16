import { Wholesale } from "@/libs/models/wholesale";

export type WholesaleDetail = {
  id: string;
  wholesaleId: number;
  desc: string;
  min: number;
  max: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  wholesale?: Wholesale;
};
