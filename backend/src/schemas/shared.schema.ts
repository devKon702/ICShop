import { z } from "zod";

export const idStringSchema = z.coerce.number().min(1, "ID không hợp lệ");

export const findByIdSchema = z.object({
  params: z.object({
    id: idStringSchema,
  }),
});
