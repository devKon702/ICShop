import { Request, Response } from "express";
import { RateLimitPolicies } from "../middlewares/limiter.middleware";
import { TokenPayload } from "../types/token-payload";
import redisService, { redisKeys } from "./redis.service";
import { ICaptchaService, TurnstileCaptchaService } from "./captcha.service";
import RateLimitError from "../errors/rate-limit.error";

type RateLimitPolicy =
  (typeof RateLimitPolicies)[keyof typeof RateLimitPolicies];

export interface IRateLimitService {
  getActorKey(req: Request, res: Response, actorType?: "IP" | "USER"): string;
  getCount(policy: RateLimitPolicy, actor: string): Promise<number>;
  hasRateLimitBypass(policy: RateLimitPolicy, actor: string): Promise<boolean>;
  increment(policy: RateLimitPolicy, actor: string): Promise<number>;
  handleExceed(
    policy: RateLimitPolicy,
    actor: string,
    captchaToken?: string
  ): Promise<void>;
  reset: (policy: RateLimitPolicy, actor: string) => Promise<void>;
}

export class RedisRateLimitService implements IRateLimitService {
  public getActorKey(
    req: Request,
    res: Response,
    actorType: "IP" | "USER" = "USER"
  ): string {
    if (actorType === "USER") {
      return String(
        (res.locals.tokenPayload as TokenPayload)?.sub ?? req.ip ?? "unknown"
      );
    } else {
      return req.ip ?? "unknown";
    }
  }

  public async getCount(
    policy: RateLimitPolicy,
    actor: string
  ): Promise<number> {
    const rlKey = redisKeys.rateLimit(policy.name, actor);
    const rlCount = await redisService.getValue<number>(rlKey);
    return rlCount ?? 0;
  }

  public async hasRateLimitBypass(
    policy: RateLimitPolicy,
    actor: string
  ): Promise<boolean> {
    if (
      policy.type === "CAPTCHA" &&
      (await redisService.exists(redisKeys.captchaPassed(policy.name, actor)))
    ) {
      // Check if captcha passed key exists
      const passedUsageCount = await redisService.incrementKey(
        redisKeys.captchaPassed(policy.name, actor)
      ); // Increment usage count
      if (passedUsageCount <= policy.max) {
        return true;
      }
      // If usage count exceeded max, delete the key
      await redisService.deleteKey(redisKeys.captchaPassed(policy.name, actor));
    }
    return false;
  }

  public async increment(
    policy: RateLimitPolicy,
    actor: string
  ): Promise<number> {
    const rlKey = redisKeys.rateLimit(policy.name, actor);
    const rlCount = await redisService.incrementKey(rlKey);

    if (rlCount === 1) {
      // First request, set expiration
      await redisService.pexpireKey(rlKey, policy.windowMs);
    }
    return rlCount;
  }

  public async handleExceed(
    policy: RateLimitPolicy,
    actor: string,
    captchaToken?: string
  ): Promise<void> {
    // If CAPTCHA type, check for captcha token
    if (policy.type === "CAPTCHA") {
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
        return;
      }
    }
    if (policy.type === "CAPTCHA") {
      throw new RateLimitError(
        { requireCaptcha: true, policy: policy.name },
        "Vui lòng hoàn thành CAPTCHA để tiếp tục."
      );
    } else {
      throw new RateLimitError(
        undefined,
        "Quá nhiều yêu cầu, vui lòng thử lại sau."
      );
    }
  }
  public async reset(policy: RateLimitPolicy, actor: string): Promise<void> {
    const rlKey = redisKeys.rateLimit(policy.name, actor);
    await redisService.deleteKey(rlKey);
  }
}
