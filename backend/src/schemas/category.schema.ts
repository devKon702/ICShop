import { z } from "zod";

export const GetCategorySchema = z.object({
  slug: z.string(),
});
