import { z } from "zod";

export const createProductImageSchema = z.object({
  body: z.object({ productId: z.coerce.number() }),
});

export const deleteProductImageSchema = z.object({
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});

export const updateProductImagePositionSchema = z.object({
  body: z.object({
    gallery: z.array(
      z.object({
        id: z.number(),
        position: z.number().min(1, "Giá trị nhỏ nhất là 1"),
      })
    ),
  }),
});

export const updateProductImageSchema = z.object({
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});
