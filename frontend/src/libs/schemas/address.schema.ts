import { z } from "zod";
import {
  ID,
  UnsignedInt,
  TinyText,
  Text,
  DateTimeSchema,
} from "../schemas/shared.schema";

export const AddressSchema = z.object({
  id: ID,
  userId: UnsignedInt,
  alias: TinyText,
  receiverName: TinyText,
  receiverPhone: z.string(),
  province: TinyText,
  district: TinyText,
  commune: TinyText,
  detail: Text,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export type Address = z.infer<typeof AddressSchema>;
