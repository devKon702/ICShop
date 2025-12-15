import rateLimit from "express-rate-limit";
import { failResponse } from "../utils/response";
import { AuthResponseCode } from "../constants/codes/auth.code";

export const createLimiter = (options: {
  windowMs: number;
  max: number;
  message?: any;
}) => {
  return rateLimit({
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: failResponse(
      "TOO_MANY_REQUESTS",
      "Quá nhiều yêu cầu, vui lòng thử lại sau."
    ),
    ...options,
  });
};

export const globalLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: failResponse(
    "TOO_MANY_REQUESTS",
    "Quá nhiều yêu cầu, vui lòng thử lại sau."
  ),
});

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: failResponse(
    AuthResponseCode.TOO_MANY_LOGIN_ATTEMPTS,
    "Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 5 phút."
  ),
});

export const signupLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minute
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Only count failed requests toward the rate limit
  message: failResponse(
    "TOO_MANY_REQUESTS",
    "Quá nhiều lần thử đăng ký, vui lòng thử lại sau 10 phút."
  ),
});

export const refreshTokenLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: failResponse(
    "TOO_MANY_REQUESTS",
    "Quá nhiều yêu cầu làm mới token, vui lòng thử lại sau 1 phút."
  ),
});

export const sendOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: failResponse(
    "TOO_MANY_REQUESTS",
    "Quá nhiều yêu cầu gửi OTP, vui lòng thử lại sau 5 phút."
  ),
});
