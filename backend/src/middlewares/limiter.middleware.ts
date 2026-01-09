import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error";
import {
  IRateLimitService,
  RedisRateLimitService,
} from "../services/rate-limit.service";

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
    type: "CAPTCHA",
  },
  GOOGLE_LOGIN: {
    name: "GOOGLE_LOGIN",
    windowMs: 10 * 60 * 1000,
    max: 10,
    type: "BLOCK",
  },
  ADMIN_LOGIN: {
    name: "ADMIN_LOGIN",
    windowMs: 10 * 60 * 1000,
    max: 5,
    type: "BLOCK",
  },
  LOG_OUT: {
    name: "LOG_OUT",
    windowMs: 5 * 60 * 1000,
    max: 10,
    type: "BLOCK",
  },
  REGISTER: {
    name: "REGISTER",
    windowMs: 10 * 60 * 1000,
    max: 10,
    type: "BLOCK",
  },
  REFRESH_TOKEN: {
    name: "REFRESH_TOKEN",
    windowMs: 5 * 60 * 1000,
    max: 40,
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
  policy: (typeof RateLimitPolicies)[keyof typeof RateLimitPolicies],
  configs?: {
    skipIncrement?: (req: Request, res: Response) => boolean;
  }
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const rateLimitService: IRateLimitService = new RedisRateLimitService();
    const actor = rateLimitService.getActorKey(req, res);

    console.log(`Rate Limiter: [${policy.name}] Actor: ${actor}`);

    // If CAPTCHA type policy
    const isByPassed = await rateLimitService.hasRateLimitBypass(policy, actor);
    if (!isByPassed) {
      const currentCount = await rateLimitService.getCount(policy, actor);
      if (currentCount >= policy.max) {
        await rateLimitService.handleExceed(
          policy,
          actor,
          req.headers["x-captcha-token"] as string | undefined
        );
      }
      if (!configs?.skipIncrement?.(req, res)) {
        await rateLimitService.increment(policy, actor);
      }
    }
    next();

    // if (
    //   policy.type === "CAPTCHA" &&
    //   (await redisService.exists(redisKeys.captchaPassed(policy.name, actor)))
    // ) {
    //   // Check if captcha passed key exists
    //   const passedUsageCount = await redisService.incrementKey(
    //     redisKeys.captchaPassed(policy.name, actor)
    //   ); // Increment usage count
    //   if (passedUsageCount <= policy.max) {
    //     return next();
    //   }
    //   // If usage count exceeded max, delete the key
    //   await redisService.deleteKey(redisKeys.captchaPassed(policy.name, actor));
    // }

    // // Increment rate limit count
    // const rlKey = redisKeys.rateLimit(policy.name, actor);
    // if (configs?.skipIncrement?.(req, res)) {
    //   const rlCount = await redisService.incrementKey(rlKey);

    //   if (rlCount === 1) {
    //     // First request, set expiration
    //     await redisService.pexpireKey(rlKey, policy.windowMs);
    //   }
    // }

    // const rlCount = await redisService.getValue<number>(rlKey);

    // // If rate limit max exceeded
    // if (rlCount && rlCount > policy.max) {
    //   // If CAPTCHA type, check for captcha token
    //   if (policy.type === "CAPTCHA") {
    //     const captchaToken = req.headers["x-captcha-token"] as
    //       | string
    //       | undefined;
    //     // Get Turnstile Captcha
    //     const captchaService: ICaptchaService = new TurnstileCaptchaService();
    //     const verified = captchaToken
    //       ? await captchaService.verifyCaptcha(captchaToken)
    //       : false;
    //     if (verified) {
    //       // Store captcha passed key with expiration equal to rate limit window
    //       await redisService.setValue(
    //         redisKeys.captchaPassed(policy.name, actor),
    //         1,
    //         policy.windowMs / 1000
    //       );
    //       return next();
    //     }
    //   }
    //   if (policy.type === "CAPTCHA") {
    //     throw new RateLimitError(
    //       { requireCaptcha: true, policy: policy.name },
    //       "Vui lòng hoàn thành CAPTCHA để tiếp tục."
    //     );
    //   } else {
    //     throw new RateLimitError(
    //       undefined,
    //       "Quá nhiều yêu cầu, vui lòng thử lại sau."
    //     );
    //   }
    // }
    // next();
  };
};

export const createFailureLimiter = (
  policy: (typeof RateLimitPolicies)[keyof typeof RateLimitPolicies],
  controller: (
    req: Request,
    res: Response,
    next?: NextFunction
  ) => Promise<void>,
  actorType: "IP" | "USER" = "IP",
  excludedCodes?: string[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const rateLimitService: IRateLimitService = new RedisRateLimitService();
    const actor = rateLimitService.getActorKey(req, res, actorType);
    try {
      await controller(req, res, next);
      // Success -> reset rate limit count
      await rateLimitService.reset(policy, actor);
    } catch (error) {
      if (error instanceof AppError && !excludedCodes?.includes(error.code)) {
        /// Increment failure rate limit count
        await rateLimitService.increment(policy, actor);
      }
      next(error);
    }
  };
};

export const createSuccessLimiter = (
  policy: (typeof RateLimitPolicies)[keyof typeof RateLimitPolicies],
  controller: (
    req: Request,
    res: Response,
    next?: NextFunction
  ) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const rateLimitService: IRateLimitService = new RedisRateLimitService();
    const actor = rateLimitService.getActorKey(req, res);
    try {
      await controller(req, res, next);
      // Success -> increment success rate limit count
      await rateLimitService.increment(policy, actor);
    } catch (error) {
      next(error);
    }
  };
};

export const createEnforceRateLimiter = (
  policy: (typeof RateLimitPolicies)[keyof typeof RateLimitPolicies]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {};
};
