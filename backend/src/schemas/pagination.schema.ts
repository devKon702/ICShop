import { z } from "zod";

export const PaginationSchema = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number(),
});
