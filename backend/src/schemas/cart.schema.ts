import { z } from "zod";

export const createCartSchema = z.object({
  body: z.object({
    productId: z.number(),
  }),
});

export const deleteMultiCartSchema = z.object({
  body: z.object({
    cartIds: z
      .array(z.number().min(1, "ID không hợp lệ"))
      .min(1, "Có ít nhất một phần tử"),
  }),
});
