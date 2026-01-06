import rateLimit from "express-rate-limit";
import { failResponse } from "../utils/response";
import { AuthResponseCode } from "../constants/codes/auth.code";
import { NextFunction, Request, Response } from "express";
import redisService, { redisKeys } from "../services/redis.service";
import { TokenPayload } from "../types/token-payload";
import redis from "../utils/redis";
import { HttpStatus } from "../constants/http-status";
import {
  ICaptchaService,
  TurnstileCaptchaService,
} from "../services/captcha.service";

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

export const RateLimitPolicies = {
  GLOBAL: {
    name: "GLOBAL",
    windowMs: 2 * 60 * 1000,
    max: 100,
    type: "CAPTCHA",
  },
  LOGIN: {
    name: "LOGIN",
    windowMs: 10 * 60 * 1000,
    max: 10,
    type: "BLOCK",
  },
  REGISTER: {
    name: "REGISTER",
    windowMs: 10 * 60 * 1000,
    max: 10,
    type: "BLOCK",
  },
  FORGOT_PASSWORD: {
    name: "FORGOT_PASSWORD",
    windowMs: 15 * 60 * 1000,
    max: 5,
    type: "BLOCK",
  },
  SENT_OTP: {
    name: "SENT_OTP",
    windowMs: 5 * 60 * 1000,
    max: 5,
    type: "BLOCK",
  },
} satisfies Record<
  string,
  { name: string; windowMs: number; max: number; type: "BLOCK" | "CAPTCHA" }
>;

export const createRateLimiter = (
  policy: (typeof RateLimitPolicies)[keyof typeof RateLimitPolicies]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const actor = String(
      (res.locals.tokenPayload as TokenPayload)?.sub ?? req.ip ?? "unknown"
    );

    // If CAPTCHA type policy
    if (
      policy.type === "CAPTCHA" &&
      (await redisService.exists(redisKeys.captchaPassed(policy.name, actor)))
    ) {
      // Check if captcha passed key exists
      return next();
    }

    // Increment rate limit count
    const rlKey = redisKeys.rateLimit(policy.name, actor);
    const rlCount = await redisService.incrementKey(rlKey);

    if (rlCount === 1) {
      // First request, set expiration
      await redisService.pexpireKey(rlKey, policy.windowMs);
    }

    // If rate limit max exceeded
    if (rlCount > policy.max) {
      // If CAPTCHA type, check for captcha token
      if (policy.type === "CAPTCHA") {
        const captchaToken = req.headers["x-captcha-token"] as
          | string
          | undefined;
        // Get Turnstile Captcha
        const captchaService: ICaptchaService = new TurnstileCaptchaService();
        const verified = captchaToken
          ? await captchaService.verifyCaptcha(captchaToken)
          : false;
        if (verified) {
          // Store captcha passed key with expiration equal to rate limit window
          await redisService.pexpireKey(
            redisKeys.captchaPassed(policy.name, actor),
            policy.windowMs / 1000
          );
          return next();
        }
      }
      res
        .status(HttpStatus.TOO_MANY_REQUESTS)
        .json(
          failResponse(
            "TOO_MANY_REQUESTS",
            policy.type === "BLOCK"
              ? "Quá nhiều yêu cầu, vui lòng thử lại sau."
              : "Vui lòng hoàn thành CAPTCHA để tiếp tục.",
            policy.type === "CAPTCHA"
              ? { requireCaptcha: true, policy: policy.name }
              : undefined
          )
        );
      return;
    }
    next();
  };
};
