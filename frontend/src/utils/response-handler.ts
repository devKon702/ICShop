import ApiError, { ApiErrorType } from "@/libs/errors/ApiError";
import { ApiErrorResponseSchema } from "@/libs/schemas/response.schema";
import { AxiosError, AxiosResponse } from "axios";
import { z, ZodSchema } from "zod";

export async function axiosHandler<T>(
  request: Promise<AxiosResponse>,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const res = await request;
    const parsed = schema.safeParse(res.data);
    // If response data does not match the schema, throw an validation error
    if (!parsed.success) {
      throw new ApiError({
        type: "API",
        message: "Response data validation failed",
      });
    }
    return parsed.data;
  } catch (err) {
    console.error(err);
    // Handle Axios errors specifically
    if (err instanceof AxiosError) {
      const parsedError = ApiErrorResponseSchema.safeParse(err.response?.data);
      // If the error response is from API, throw an API Error
      if (parsedError.success) {
        throw new ApiError({
          type: "API",
          message: parsedError.data.message,
          code: parsedError.data.code,
          errors: parsedError.data.errors,
        });
      }
      // If not, check for network or timeout errors
      switch (err.code) {
        case "ECONNABORTED":
          throw new ApiError({
            type: "TIMEOUT",
            message: "Yêu cầu đã hết thời gian chờ",
          });
        case "ERR_NETWORK":
          throw new ApiError({
            type: "NETWORK",
            message: "Lỗi mạng",
          });
        default:
          break;
      }
    }
    throw err;
  }
}

export async function fetchHandler<T>(
  request: Promise<Response>,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const res = await request;
    const contentType = res.headers.get("Content-Type");
    if (!res.ok) {
      if (contentType.includes("application/json")) {
        const errorData = await res.json();
        const parsedError = ApiErrorResponseSchema.safeParse(errorData);
        // If the error response is from API, throw an API Error
        console.log("Parsed Error:", errorData);
        if (parsedError.success) {
          throw new ApiError({
            type: "API",
            message: parsedError.data.message,
            code: parsedError.data.code,
            errors: parsedError.data.errors,
          });
        }
      }
      throw new ApiError({
        type: "API",
        message: `${res.status} ${res.statusText}`,
      });
    }
    // If successful, parse and validate the response data
    const data = await res.json();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      // If response data does not match the schema, throw a validation error
      throw new ApiError({
        type: "API",
        message: "Response data validation failed",
      });
    }
    return parsed.data;
  } catch (err) {
    console.error(err);
    if (err instanceof TypeError) {
      throw new ApiError({
        type: "NETWORK",
        message: err.message,
      });
    }
    throw err;
  }
}

export function createErrorHandler(
  apiHandlers: {
    code: string;
    handler: (
      message: string,
      errors?: z.infer<typeof ApiErrorResponseSchema.shape.errors>
    ) => void;
  }[],
  options?: { type: ApiErrorType; handler: (message: string) => void }[]
) {
  return (error: ApiError | unknown) => {
    if (error instanceof ApiError) {
      if (error.type === "API") {
        const matchedHandler = apiHandlers.find(
          (h) => h.code === error.code
        )?.handler;
        if (matchedHandler) {
          matchedHandler(error.message, error.errors);
          return;
        }
      }
      // Check error type to see if it matches any provided options
      const option = options?.find((option) => option.type === error.type);
      if (option) {
        option.handler(error.message);
        return;
      }
    }
    console.error("Unhandled error:", error);
  };
}
