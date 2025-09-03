import { z } from "zod";
import { ID, UnsignedInt, DateTimeSchema } from "../schemas/shared.schema";

export const CartDetailSchema = z.object({
  id: ID,
  userId: UnsignedInt,
  productId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export type CartDetail = z.infer<typeof CartDetailSchema>;
