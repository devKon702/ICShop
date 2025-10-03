import { z } from "zod";
import {
  ID,
  UnsignedInt,
  TinyText,
  Text,
  DateTimeSchema,
} from "../schemas/shared.schema";

export const AddressBaseSchema = z.object({
  id: ID,
  userId: UnsignedInt,
  alias: TinyText,
  receiverName: TinyText,
  receiverPhone: z.string(),
  province: TinyText,
  provinceCode: UnsignedInt,
  district: TinyText,
  districtCode: UnsignedInt,
  commune: TinyText,
  communeCode: UnsignedInt,
  detail: Text,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export type Address = z.infer<typeof AddressBaseSchema>;
