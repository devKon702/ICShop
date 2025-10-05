import { ApiErrorResponseSchema } from "@/libs/schemas/response.schema";
import { AxiosError, AxiosResponse } from "axios";
import { ZodSchema } from "zod";

export async function axiosHandler<T>(
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
    console.log(err);
    throw err;
  }
}

export async function fetchHandler<T>(
  request: Promise<Response>,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const res = await request;
    const contentType = res.headers.get("content-type");
    if (!res.ok) {
      if (contentType === "application/json") {
        const errorData = await res.json();
        const parsedError = ApiErrorResponseSchema.safeParse(errorData);
        if (parsedError.success) {
          throw parsedError.data;
        }
      }
      throw new Error(`HTTP error! status: ${res.status} ${res.statusText} `);
    }

    const data = await res.json();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw parsed.error;
    }
    return parsed.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
