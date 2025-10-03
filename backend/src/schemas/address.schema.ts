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
    detail: z.string().nonempty(),
    communeCode: z.number().min(1, "Phường/Xã không được để trống"),
    districtCode: z.number().min(1, "Quận/Huyện không được để trống"),
    provinceCode: z.number().min(1, "Tỉnh/Thành phố không được để trống"),
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
    detail: z.string().nonempty(),
    communeCode: z.number().min(1, "Phường/Xã không được để trống"),
    districtCode: z.number().min(1, "Quận/Huyện không được để trống"),
    provinceCode: z.number().min(1, "Tỉnh/Thành phố không được để trống"),
  }),
});

export const deleteAddressSchema = z.object({
  params: z.object({
    id: z.coerce.number().min(1, "ID không hợp lệ"),
  }),
});
