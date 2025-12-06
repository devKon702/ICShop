export type ApiErrorType = "API" | "NETWORK" | "UNKNOWN" | "TIMEOUT";

export default class ApiError extends Error {
  type: ApiErrorType;
  code?: string;
  errors?: { field: string; message: string }[];
  constructor(options: {
    type: ApiErrorType;
    message: string;
    code?: string;
    errors?: { field: string; message: string }[];
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
