import { z } from "zod";

// Generic API response schema
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    message: z.string(),
    code: z.string(),
    data: dataSchema,
  });

// Paginated response schema
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

// API error response schema
export const ApiErrorResponseSchema = z.object({
  message: z.string(),
  code: z.string(),
  errors: z
    .object({
      validateErrors: z
        .array(
          z.object({
            field: z.string(),
            message: z.string(),
          })
        )
        .optional(),
      requireCaptcha: z.boolean().optional(),
      policy: z.string().optional(),
    })
    .optional(),
});
