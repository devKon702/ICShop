import { z } from "zod";
import { requestSchema } from "./shared.schema";

export const getBestSellingProductsSchema = requestSchema({
  query: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
    limit: z.coerce.number().min(1).default(10),
    page: z.coerce.number().min(1).default(1),
    sortBy: z.enum(["quantity", "revenue", "order"]).default("order"),
  }),
});
