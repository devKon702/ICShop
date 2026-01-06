import crypto from "crypto";
import { compareString, hashString } from "../utils/bcrypt";
import redis, { redisKeys } from "../utils/redis";
import mailService from "./mail.service";
import { env } from "../constants/env";
import { generateOTPHtml } from "../utils/html";
type OTPOptions =
  | {
      expiredAt?: never;
      expiredInSeconds: number;
    }
  | {
      expiredAt: Date;
      expiredInSeconds?: never;
    };

class OTPService {
  public generateOTP(length: number): string {
    const otp = crypto
      .randomInt(10 ** (length - 1), 10 ** length - 1)
      .toString();
    return otp;
  }

  public async save(
    email: string,
    code: string,
    expiredInSeconds: number
  ): Promise<void> {
    const hashOtp = await hashString(code);
    // Save to redis
    const ttlSeconds = expiredInSeconds;
    await redis.setValue(redisKeys.otpEmail(email), hashOtp, ttlSeconds);
  }

  public async verify(email: string, code: string): Promise<boolean> {
    const hashOtp = await redis.getValue<string>(redisKeys.otpEmail(email));
    if (!hashOtp) return false;
    const result = await compareString(code, hashOtp);
    if (result) {
      await redis.deleteKey(redisKeys.otpEmail(email));
    }
    return result;
  }

  public async send(
    email: string,
    code: string,
    expiredInSeconds: number
  ): Promise<void> {
    const html = generateOTPHtml({
      otp: code,
      expiredInSeconds,
      appName: env.APP_NAME,
    });
    await mailService.send({
      to: email,
      subject: `${env.APP_NAME} - Mã OTP xác thực email`,
      html,
    });
  }
}

export default new OTPService();
