import { failResponse } from "../utils/response";
import { NextFunction, Request, Response } from "express";
import redisService, { redisKeys } from "../services/redis.service";
import { TokenPayload } from "../types/token-payload";
import { HttpStatus } from "../constants/http-status";
import {
  ICaptchaService,
  TurnstileCaptchaService,
} from "../services/captcha.service";
import { SecurityResponseCode } from "../constants/codes/security.code";

export const RateLimitPolicies = {
  GLOBAL: {
    name: "GLOBAL",
    windowMs: 2 * 60 * 1000,
    max: 100,
    type: "BLOCK",
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
  CREATE_ORDER: {
    name: "CREATE_ORDER",
    windowMs: 10 * 60 * 1000,
    max: 10,
    type: "CAPTCHA",
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

    console.log(`Rate Limiter: [${policy.name}] Actor: ${actor}`);

    // If CAPTCHA type policy
    if (
      policy.type === "CAPTCHA" &&
      (await redisService.exists(redisKeys.captchaPassed(policy.name, actor)))
    ) {
      // Check if captcha passed key exists
      const passedUsageCount = await redisService.incrementKey(
        redisKeys.captchaPassed(policy.name, actor)
      ); // Increment usage count
      if (passedUsageCount <= policy.max) {
        return next();
      }
      // If usage count exceeded max, delete the key
      await redisService.deleteKey(redisKeys.captchaPassed(policy.name, actor));
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
          await redisService.setValue(
            redisKeys.captchaPassed(policy.name, actor),
            1,
            policy.windowMs / 1000
          );
          return next();
        }
      }
      res
        .status(HttpStatus.TOO_MANY_REQUESTS)
        .json(
          failResponse(
            SecurityResponseCode.TOO_MANY_REQUESTS,
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
