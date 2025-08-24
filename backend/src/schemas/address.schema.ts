import { z } from "zod";
import { phoneRegex, vietnameseRegex } from "../utils/regex";

export const createAddressSchema = z.object({
  body: z.object({
    alias: z
      .string()
      .regex(vietnameseRegex(true), "Tên không bao gồm các kí tự đặc biệt"),
    receiverPhone: z.string().regex(phoneRegex(), "Số điện thoại không hợp lệ"),
    receiverName: z
      .string()
      .regex(vietnameseRegex(false), "Tên chỉ bao gồm chữ cái"),
    detail: z.string(),
    commune: z.string(),
    district: z.string(),
    province: z.string(),
  }),
});

export const updateAddressSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    alias: z
      .string()
      .regex(vietnameseRegex(true), "Tên không bao gồm các kí tự đặc biệt"),
    receiverPhone: z.string().regex(phoneRegex(), "Số điện thoại không hợp lệ"),
    receiverName: z
      .string()
      .regex(vietnameseRegex(false), "Tên chỉ bao gồm chữ cái"),
    detail: z.string(),
    commune: z.string(),
    district: z.string(),
    province: z.string(),
  }),
});

export const deleteAddressSchema = z.object({
  params: z.object({ id: z.coerce.number() }),
});
