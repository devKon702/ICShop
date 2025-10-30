import { z, ZodSchema } from "zod";

export const idStringSchema = z.coerce.number().min(1, "ID không hợp lệ");

export const findByIdSchema = z.object({
  params: z.object({
    id: idStringSchema,
  }),
});

export const requestSchema = <
  S extends {
    body?: ZodSchema<any>;
    params?: ZodSchema<any>;
    query?: ZodSchema<any>;
  }
>(
  schema: S
) => {
  const shape: Record<string, ZodSchema<any>> = {};
  if (schema.body) shape.body = schema.body;
  if (schema.params) shape.params = schema.params;
  if (schema.query) shape.query = schema.query;

  // cast so TypeScript can infer the parsed data shape via z.infer<typeof result>
  return z.object(shape) as unknown as z.ZodObject<
    { [K in keyof S]: S[K] extends ZodSchema ? S[K] : never },
    "strip",
    z.ZodTypeAny,
    { [K in keyof S]: S[K] extends ZodSchema ? z.infer<S[K]> : never }
  >;
};
