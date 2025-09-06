import { ApiErrorResponseSchema } from "@/libs/schemas/response.schema";
import { AxiosError, AxiosResponse } from "axios";
import { ZodSchema } from "zod";

async function requestHandler<T>(
  request: Promise<AxiosResponse>,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const res = await request;
    const parsed = schema.safeParse(res.data);
    if (!parsed.success) {
      throw parsed.error;
    }
    return parsed.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const parsedError = ApiErrorResponseSchema.safeParse(err.response?.data);
      if (parsedError.success) {
        throw parsedError.data;
      }
    }
    throw err;
  }
}

export default requestHandler;
