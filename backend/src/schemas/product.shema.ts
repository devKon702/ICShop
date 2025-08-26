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
const hasGap = (ranges: { min: number; max: number | null }[]) => {
  if (ranges.length === 0) return false;

  // object has max will in the last
  // const sorted = [...ranges].sort((a, b) => {
  //   if (a.max === null) return 1;
  //   if (b.max === null) return -1;
  //   return a.min - b.min;
  // });

  for (let i = 1; i < ranges.length; i++) {
    const prev = ranges[i - 1];
    const curr = ranges[i];

    // If curr.min > prev.max + 1 && prev.max != null => has gap
    if (prev.max !== null && curr.min > prev.max + 1) {
      return true;
    }
  }

  return false;
};
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().nonempty(),
    categoryId: z.number(),
    desc: z.string().nullable(),
    datasheetLink: z.string().max(250, "Tối đa 250 kí tự").nullable(),
    weight: z.number().min(0, "Cân nặng tối thiểu 0 gram"),
    vat: z.number().min(0, "Giá thuế tối thiểu là 0%"),
    wholesale: z
      .object({
        min_quantity: z.number(),
        max_quantity: z.number(),
        unit: z.string().nonempty(),
        quantity_step: z.number().min(1, "Bội số tối thiểu là 1"),
        details: z
          .array(
            z
              .object({
                min: z.number(),
                max: z.number().nullable(),
                price: z.number(),
                desc: z.string().nonempty(),
              })
              .refine(
                (val) => val.max == null || val.min <= val.max,
                "Khoảng giá không hợp lệ"
              )
          )
          .min(1, "Tối thiểu có một giá bán")
          .transform((arr) =>
            arr.sort((a, b) => {
              if (a.max === null) return 1;
              if (b.max === null) return -1;
              return a.min - b.min;
            })
          )
          .refine(
            (arr) =>
              !hasGap(arr.map((item) => ({ min: item.min, max: item.max }))),
            "Bảng giá có khoảng trông"
          ),
      })
      .refine(
        (data) => data.max_quantity >= data.min_quantity,
        "Phạm vi số lượng mua không hợp lệ"
      )
      .refine(
        (data) =>
          data.details.some(
            (item) => item.max === null || item.max >= data.max_quantity
          ) && data.details.some((item) => item.min <= data.min_quantity),
        "Bảng giá chưa bao quát hết số lượng mua của sản phẩm"
      ),
    valueIds: z.array(z.number()),
  }),
});

export const getProductBySlugSchema = z.object({
  params: z.object({ slug: z.string().nonempty() }),
});

export const getProductByIdSchema = z.object({
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});

export const filterProductSchema = z.object({
  query: z.object({
    name: z.string(),
    c: z.string(),
    attrid: z.string(),
  }),
});
