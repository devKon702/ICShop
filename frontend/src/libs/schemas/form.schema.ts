import { z } from "zod";

export const FormWholesaleSchema = z
  .object({
    min_quantity: z.coerce
      .number({ message: "Không bỏ trống" })
      .int("Phải là kiểu số nguyên")
      .min(1, "Tối thiếu 1")
      .max(100, "Tối đa 100"),
    max_quantity: z.coerce
      .number()
      .int("Phải là kiểu số nguyên")
      .max(999, "Tối đa 999"),
    unit: z.coerce
      .string({ message: "Không bỏ trống" })
      .nonempty("Không bỏ trống")
      .max(100, "Tối đa 100 kí tự"),
    quantity_step: z.coerce
      .number()
      .int("Phải là kiểu số nguyên")
      .min(1, "Bội số tối thiểu là 1"),
    vat: z.coerce
      .number()
      .int({ message: "Phải là số nguyên" })
      .min(0, "Tối thiểu 0%")
      .max(10000, "Tối đa 100%"),
    details: z.array(
      z.object({
        min: z.coerce
          .number()
          .int("Phải là kiểu số nguyên")
          .min(1, "Tối thiểu là 0"),
        max: z.null(),
        price: z.coerce
          .number()
          .min(0, "Giá tối thiểu là 0")
          .max(999999999, "Tối đa 999,999,999"),
        desc: z.string().nonempty(),
      })
    ),
  })
  .refine(
    (data) => data.max_quantity - data.min_quantity >= data.quantity_step,
    "Bội số mua không hợp lệ"
  )
  .refine(
    (data) => data.max_quantity >= data.min_quantity,
    "Phạm vi số lượng mua không hợp lệ"
  )
  .refine(
    (data) => data.details.some((item) => item.min <= data.min_quantity),
    "Còn mức mua chưa lập giá"
  );

export const FormProductSchema = z.object({
  name: z.string({ message: "Không bỏ trống" }).nonempty("Không bỏ trống"),
  categoryId: z.coerce.number({ message: "Chọn một danh mục" }),
  desc: z.string().optional(),
  datasheetLink: z.string().max(250, "Tối đa 250 kí tự").optional(),
  weight: z.coerce
    .number({ message: "Không bỏ trống" })
    .int("Phải là kiểu số nguyên")
    .min(0, "Cân nặng tối thiểu 0 gram")
    .max(1000 * 1000, "Cân nặng tối đa 1 tấn"),
  wholesale: FormWholesaleSchema,
  valueIds: z.array(
    z.coerce.number().int("ID là kiểu số nguyên").min(1, "ID không hợp lệ")
  ),
});
