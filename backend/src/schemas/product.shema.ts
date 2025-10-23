import z, { boolean, number } from "zod";
import { PaginationSchema } from "./pagination.schema";
import { vietnameseRegex } from "../utils/regex";
import { brotliDecompress } from "zlib";

const hasGap = (sortedRanges: { min: number; max: number | null }[]) => {
  if (sortedRanges.length === 0) return false;

  for (let i = 1; i < sortedRanges.length; i++) {
    const prev = sortedRanges[i - 1];
    const curr = sortedRanges[i];

    // If curr.min > prev.max + 1 && prev.max != null => has gap
    if (prev.max !== null && curr.min > prev.max + 1) {
      return true;
    }
  }

  return false;
};

const wholesaleSchema = z
  .object({
    min_quantity: z
      .number()
      .int("Phải là kiểu số nguyên")
      .min(1, "Tối thiếu 1"),
    max_quantity: z.number().int("Phải là kiểu số nguyên"),
    unit: z.string().nonempty(),
    quantity_step: z
      .number()
      .int("Phải là kiểu số nguyên")
      .min(1, "Bội số tối thiểu là 1"),
    vat: z.number().min(0, "Giá thuế tối thiểu là 0%"),
    details: z
      .array(
        z
          .object({
            min: z
              .number()
              .int("Phải là kiểu số nguyên")
              .min(1, "Tối thiểu là 0"),
            max: z
              .number()
              .int("Phải là kiểu số nguyên")
              .nullable()
              .default(null),
            price: z.number().min(0, "Giá tối thiểu là 0"),
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
          if (a.max === null && b.max === null) return a.min - b.min;
          if (a.max === null) return 1;
          if (b.max === null) return -1;
          return a.min - b.min;
        })
      )
      .refine(
        (arr) => !hasGap(arr.map((item) => ({ min: item.min, max: item.max }))),
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
  );

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().nonempty(),
    categoryId: z.number(),
    desc: z.string().nullable(),
    datasheetLink: z.string().max(250, "Tối đa 250 kí tự").nullable(),
    weight: z
      .number()
      .int("Phải là kiểu số nguyên")
      .min(0, "Cân nặng tối thiểu 0 gram")
      .max(1000 * 1000, "Cân nặng tối đa 1 tấn"),
    wholesale: wholesaleSchema,
    valueIds: z.array(
      z.number().int("ID là kiểu số nguyên").min(1, "ID không hợp lệ")
    ),
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
    name: z.string().nonempty().trim().optional(),
    cid: z.coerce.number().min(1, "ID không hợp lệ").optional(),
    page: z.coerce
      .number()
      .transform((val) => (val <= 0 ? 1 : val))
      .default(1),
    limit: z.coerce
      .number()
      .transform((val) => (val <= 0 ? 10 : val))
      .default(10),
    order: z
      .enum(["price_asc", "price_desc", "none", "date_asc", "date_desc"])
      .default("date_desc"),
    active: z
      .enum(["0", "1"])
      .transform((val) => !!-val)
      .optional(),
  }),
});

export const getProductByName = z.object({
  query: z.object({
    name: z.string().nonempty(),
    page: z.coerce
      .number()
      .transform((val) => (val <= 0 ? 1 : val))
      .default(1),
    limit: z.coerce
      .number()
      .transform((val) => (val <= 0 ? 1 : val))
      .default(10),
  }),
});

export const updatePosterSchema = z.object({
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().nonempty(),
    desc: z.string().trim().nullable(),
    datasheetLink: z.string().nullable(),
    weight: z
      .number()
      .int("Phải là kiểu số nguyên")
      .min(0, "Cân nặng tối thiểu 0 gram"),
  }),
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});

export const updateProductCategorySchema = z.object({
  body: z.object({
    categoryId: z.number().int("Phải là kiểu số nguyên").min(1),
    vids: z.array(z.number().int("Phải là kiểu số nguyên").min(1)),
  }),
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});

export const updateActiveProductSchema = z.object({
  body: z.object({ isActive: z.boolean() }),
  params: z.object({
    id: z.coerce.number().min(1, "ID không hợp lệ"),
  }),
});

export const updateWholesaleProductSchema = z.object({
  params: z.object({
    id: z.coerce.number().min(1, "ID không hợp lệ"),
  }),
  body: wholesaleSchema,
});
