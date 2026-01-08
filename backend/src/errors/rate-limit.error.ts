import { SecurityResponseCode } from "../constants/codes/security.code";
import { AppError } from "./app.error";

export default class RateLimitError extends AppError {
  public error?: {
    requireCaptcha: boolean;
    retryAfter?: number;
    policy: string;
  };
  constructor(
    error?: { requireCaptcha: boolean; retryAfter?: number; policy: string },
    message?: string
  ) {
    super(
      429,
      SecurityResponseCode.TOO_MANY_REQUESTS,
      message || "Quá nhiều yêu cầu. Vui lòng thử lại sau.",
      true
    );
    this.error = error;
  }
}
