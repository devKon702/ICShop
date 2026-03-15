import crypto from "crypto";
import { compareString, hashString } from "../../utils/bcrypt.util";
import mailService from "../mail.service";
import { env } from "../../constants/env";
import redisService, { redisKeys } from "../redis.service";
import { OtpChannel, otpPolicies, OtpPurpose } from "../otp";
import { AppError } from "../../errors/app.error";
import { HttpStatus } from "../../constants/http-status";

class OTPService {
  public generateOTP(length: number): string {
    const otp = crypto
      .randomInt(10 ** (length - 1), 10 ** length - 1)
      .toString();
    return otp;
  }

  /**
   * Hàm thực hiện tạo, lưu và gửi OTP cho client (Email, Sms,...)
   * @param input
   * @returns Thời gian hết hạn của OTP
   */
  public async sendOtp(input: {
    /** Email hoặc phone */
    target: string;
    /** Kênh xác thực OTP */
    channel: OtpChannel;
    /** Mục đích của OTP */
    purpose: OtpPurpose;
  }): Promise<Date> {
    const policy = otpPolicies[input.purpose];

    const otp = this.generateOTP(6);

    // Send OTP by channel
    let otpKey = null;
    // Check if channel is allowed for this policy
    if (!policy.channels.includes(input.channel)) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "INVALID_OTP_CHANNEL",
        "Kênh xác thực OTP không phù hợp",
        false,
      );
    }
    // Handle send OTP via channel
    switch (input.channel) {
      case OtpChannel.EMAIL:
        await mailService.send({
          to: input.target,
          subject: `${env.APP_NAME} - Mã OTP qua email`,
          html: policy.templates[input.channel](policy.ttlSecs, otp),
        });
        otpKey = redisKeys.otpEmail(input.purpose, input.target);
        break;
    }

    // Save to redis
    const hashOtp = await hashString(otp);
    await redisService.setValue(otpKey!, hashOtp, policy.ttlSecs);
    return new Date(Date.now() + policy.ttlSecs * 1000);
  }

  /**
   * Hàm verify otp token theo purpose
   * @param input Object chứa thông tin cần thiết để verify
   * @returns True nếu OTP hợp lệ, false nếu không
   */
  public async verifyOtp(input: {
    /** Phone hoặc email */
    target: string;
    /** Kênh xác thực */
    channel: OtpChannel;
    /** Mục đích của OTP */
    purpose: OtpPurpose;
    /** Mã OTP */
    code: string;
  }): Promise<boolean> {
    let otpKey = null;
    // Lấy OTP lưu trong redis
    switch (input.channel) {
      case "EMAIL": {
        otpKey = redisKeys.otpEmail(input.purpose, input.target);
        break;
      }
      default:
    }
    const hashOtp = !!otpKey && (await redisService.getValue<string>(otpKey));
    // Nếu otpKey == null hoặc không tìm thấy
    if (!hashOtp) return false;
    const result = await compareString(input.code, hashOtp);
    return result;
  }

  public async revokeOtp(input: {
    target: string;
    channel: OtpChannel;
    purpose: OtpPurpose;
  }) {
    let otpKey = null;
    switch (input.channel) {
      case OtpChannel.EMAIL: {
        otpKey = redisKeys.otpEmail(input.purpose, input.target);
        break;
      }
      default:
        break;
    }
    if (otpKey) {
      await redisService.deleteKey(otpKey);
    }
  }
}

export const otpService = new OTPService();
