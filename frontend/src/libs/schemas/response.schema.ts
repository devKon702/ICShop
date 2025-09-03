import { z } from "zod";

// Kiểu response chung khi thành công (không phân trang)
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    message: z.string(),
    code: z.string(),
    data: dataSchema,
  });

// Kiểu response với phân trang
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    message: z.string(),
    code: z.string(),
    data: z.object({
      result: z.array(itemSchema),
      page: z.number().int().nonnegative(),
      limit: z.number().int().positive(),
      total: z.number().int().nonnegative(),
    }),
  });

// Kiểu response khi thất bại
export const ApiErrorResponseSchema = z.object({
  message: z.string(),
  code: z.string(),
  errors: z.record(z.any()).optional(), // hoặc z.array(z.string()) tùy bạn muốn backend trả thế nào
});
