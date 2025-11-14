import crypto from "crypto";
import { compareString, hashString } from "../utils/bcrypt";
import redis, { redisKeys } from "../utils/redis";
import mailService from "./mail.service";
type OTPOptions =
  | {
      expiredAt?: never;
      expiredInSeconds: number;
    }
  | {
      expiredAt: Date;
      expiredInSeconds?: never;
    };

class EmailOTPService {
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
    const subject = "IC-Shop - Mã OTP xác thực email";
    const html = `<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.5;">
  <div style="margin-bottom: 8px;">
    Mã OTP của bạn là: <strong>${code}</strong>.
    Mã có hiệu lực trong ${Math.floor(expiredInSeconds / 60)} phút.
  </div>
</div>`;
    await mailService.send({
      to: email,
      subject,
      html,
    });
  }
}

export default new EmailOTPService();
