import z from "zod";
import { PaginationSchema } from "./pagination.schema";
import { vietnameseRegex } from "../utils/regex";

// export const FilterProductSchema = PaginationSchema.extend({
//   name: z
//     .string()
//     .transform((val) => val.trim())
//     .optional(),
//   categoryId: z.coerce.number().optional(),
//   attrids: z
//     .string()
//     .transform((val) => val.split(",").map((numStr) => BigInt(numStr)))
//     .optional(),
//   sort: z.enum(["price_asc", "price_desc", "none"]).default("none"),
// });

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().nonempty(),
    categoryId: z.number(),
    desc: z.string().default(""),
    datasheetLink: z.string().max(250, "Tối đa 250 kí tự").optional(),
    weight: z.number().min(0, "Cân nặng tối thiểu 0 gram"),
    vat: z.number().min(0, "Giá thuế tối thiểu là 0"),
    wholesale: z.object({
      min_quantity: z.number(),
      max_quantity: z.number(),
      unit: z.string().nonempty(),
      quantity_step: z.number().min(1, "Bội số tối thiểu là 1"),
      details: z
        .array(
          z.object({
            min: z.number(),
            max: z.number(),
            price: z.number(),
            desc: z.string().nonempty(),
          })
        )
        .min(1, "Tối thiểu có một giá bán"),
    }),
    valueIds: z.array(z.number()),
  }),
});
