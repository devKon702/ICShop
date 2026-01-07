import { ApiErrorResponseSchema } from "@/libs/schemas/response.schema";
import { z } from "zod";

export type ApiErrorType = "API" | "NETWORK" | "UNKNOWN" | "TIMEOUT";

export default class ApiError extends Error {
  type: ApiErrorType;
  code?: z.infer<typeof ApiErrorResponseSchema.shape.code>;
  errors?: z.infer<typeof ApiErrorResponseSchema.shape.errors>;
  constructor(options: {
    type: ApiErrorType;
    message: string;
    code?: z.infer<typeof ApiErrorResponseSchema.shape.code>;
    errors?: z.infer<typeof ApiErrorResponseSchema.shape.errors>;
  }) {
    super(options.message);
    this.type = options.type;
    this.code = options.code;
    this.errors = options.errors;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}
