import { z } from "zod";
import { requestSchema } from "./shared.schema";

export const getBestSellingProductsSchema = requestSchema({
  query: z.object({
    from: z
      .string()
      .datetime()
      .transform((val) => {
        const date = new Date(val);
        return date;
      })
      .optional(),
    to: z
      .string()
      .datetime()
      .transform((val) => {
        const date = new Date(val);
        date.setHours(23, 59, 59, 999);
        return date;
      })
      .optional(),
    limit: z.coerce.number().min(1).default(10),
    page: z.coerce.number().min(1).default(1),
    sortBy: z.enum(["quantity", "revenue", "order"]).default("order"),
  }),
});

export const countOrdersByStatusSchema = requestSchema({
  query: z.object({
    from: z
      .string()
      .datetime()
      .transform((val) => {
        const date = new Date(val);
        date.setHours(0, 0, 0, 0);
        return date;
      })
      .optional(),
    to: z
      .string()
      .datetime()
      .transform((val) => {
        const date = new Date(val);
        date.setHours(23, 59, 59, 999);
        return date;
      })
      .optional(),
  }),
});

export const countOrderDailySchema = requestSchema({
  query: z.object({
    from: z
      .string()
      .datetime()
      .transform((val) => new Date(val)),
    to: z
      .string()
      .datetime()
      .transform((val) => new Date(val)),
  }),
});

export const getTopUsersByOrderCountSchema = requestSchema({
  query: z.object({
    from: z
      .string()
      .datetime()
      .transform((val) => {
        const date = new Date(val);
        date.setHours(0, 0, 0, 0);
        return date;
      })
      .optional(),
    to: z
      .string()
      .datetime()
      .transform((val) => {
        const date = new Date(val);
        date.setHours(23, 59, 59, 999);
        return date;
      })
      .optional(),
    limit: z.coerce.number().min(1).default(10),
    sortBy: z.enum(["asc", "desc"]).default("desc"),
  }),
});

export const countUsersSchema = requestSchema({
  query: z.object({
    from: z
      .string()
      .datetime()
      .transform((val) => new Date(val))
      .optional(),
    to: z
      .string()
      .datetime()
      .transform((val) => new Date(val))
      .optional(),
    active: z
      .enum(["0", "1"])
      .transform((val) => val === "1")
      .optional(),
  }),
});
