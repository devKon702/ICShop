import { z } from "zod";

async function apiParser<T>(
  request: Promise<{ data: unknown }>,
  schema: z.ZodSchema<T>
): Promise<T> {
  const res = await request;
  return schema.parse(res.data);
}

export default apiParser;
