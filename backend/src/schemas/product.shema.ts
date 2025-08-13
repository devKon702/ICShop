import z from "zod";
import { PaginationSchema } from "./pagination.schema";

export const FilterProductSchema = PaginationSchema.extend({
  name: z
    .string()
    .transform((val) => val.trim())
    .optional(),
  categoryId: z.coerce.number().optional(),
  attrids: z
    .string()
    .transform((val) => val.split(",").map((numStr) => BigInt(numStr)))
    .optional(),
  sort: z.enum(["price_asc", "price_desc", "none"]).default("none"),
});

export type FilterProductType = z.infer<typeof FilterProductSchema>;
