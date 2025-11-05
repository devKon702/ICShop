import { z } from "zod";
import { idStringSchema, requestSchema } from "./shared.schema";
import { vietnameseRegex } from "../utils/regex";

export const createColectionSchema = requestSchema({
  body: z.object({
    name: z
      .string()
      .trim()
      .max(100, "Tên bộ sưu tập tối đa chỉ 100 ký tự")
      .nonempty("Tên bộ sưu tập không được để trống")
      .regex(vietnameseRegex(true), {
        message:
          "Tên bộ sưu tập chỉ bao gồm chữ cái tiếng Việt, số và khoảng trắng",
      }),
    desc: z.string().max(200, "Mô tả tối đa chỉ 200 ký tự").trim().optional(),
    isActive: z.boolean().default(false),
    position: z.number().int().min(1).optional(),
  }),
});

export const addProductsToCollectionSchema = requestSchema({
  params: z.object({
    id: idStringSchema,
  }),
  body: z.object({
    productId: idStringSchema,
    position: z.number().int().min(1).optional(),
  }),
});

export const updateCollectionSchema = requestSchema({
  params: z.object({
    id: idStringSchema,
  }),
  body: z
    .object({
      name: z
        .string()
        .trim()
        .max(100, "Tên bộ sưu tập tối đa chỉ 100 ký tự")
        .nonempty("Tên bộ sưu tập không được để trống")
        .regex(vietnameseRegex(true), {
          message:
            "Tên bộ sưu tập chỉ bao gồm chữ cái tiếng Việt, số và khoảng trắng",
        })
        .optional(),
      desc: z.string().trim().max(200, "Mô tả tối đa chỉ 200 ký tự").optional(),
      position: z.number().int().min(1).optional(),
      isActive: z.boolean().optional(),
    })
    .refine(
      (val) => Object.entries(val).some(([_, value]) => value !== undefined),
      "Cần có ít nhất một trường để cập nhật"
    ),
});

export const getCollectionsSchema = requestSchema({
  query: z.object({
    limit: z.number().int().min(1).default(5),
  }),
});

export const updateProductPositionInCollectionSchema = requestSchema({
  params: z.object({
    id: idStringSchema,
  }),
  body: z.object({
    position: z.number().int().min(1),
  }),
});
