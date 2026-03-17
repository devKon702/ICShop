import crypto from "crypto";
import { compareString, hashString } from "../../utils/bcrypt.util";
import mailService from "../mail.service";
import { env } from "../../constants/env";
import redisService, { redisKeys } from "../redis.service";
import { OtpChannel, otpPolicies, OtpPurpose } from "../otp";
import { AppError } from "../../errors/app.error";
import { HttpStatus } from "../../constants/http-status";

type OTPPayload = {
  hashOtp: string;
  payload: any;
};

class OTPService {
  public generateOTP(length: number): string {
    const otp = crypto
      .randomInt(10 ** (length - 1), 10 ** length - 1)
      .toString();
    return otp;
  }

  /**
   * Hàm thực hiện tạo, lưu và gửi OTP cho client (Email, Sms,...)
   * @param target Địa chỉ email hoặc phone
   * @param channel Kênh xác thực OTP (email, phone,...)
   * @param purpose Mục đích của OTP
   * @param payload Dữ liệu lưu kèm theo OTP, mặc định là null
   * @returns Thời gian hết hạn của OTP
   */
  public async sendOtp(input: {
    /** Email hoặc phone */
    target: string;
    /** Kênh xác thực OTP */
    channel: OtpChannel;
    /** Mục đích của OTP */
    purpose: OtpPurpose;
    /** Dữ liệu lưu kèm với OTP */
    payload?: any;
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
    await redisService.setValue<OTPPayload>(
      otpKey!,
      { hashOtp, payload: input.payload ?? null },
      policy.ttlSecs,
    );
    return new Date(Date.now() + policy.ttlSecs * 1000);
  }

  /**
   * Hàm verify otp token theo purpose
   * @param target Địa chỉ email hoặc phone
   * @param channel Kênh xác thực OTP (email, phone,...)
   * @param purpose Mục đích của OTP
   * @param code Chuỗi OTP cần xác thực
   * @returns Trả về {payload: T} nếu hợp lệ, null nếu không
   */
  public async verifyOtp<T = null>(input: {
    /** Phone hoặc email */
    target: string;
    /** Kênh xác thực */
    channel: OtpChannel;
    /** Mục đích của OTP */
    purpose: OtpPurpose;
    /** Mã OTP */
    code: string;
  }): Promise<{ payload: T } | null> {
    let otpKey = null;
    // Lấy OTP lưu trong redis
    switch (input.channel) {
      case "EMAIL": {
        otpKey = redisKeys.otpEmail(input.purpose, input.target);
        break;
      }
      default:
    }
    const otpPayload =
      !!otpKey &&
      (await redisService.getValue<{ hashOtp: string; payload: T }>(otpKey));
    // Nếu otpKey == null hoặc không tìm thấy
    if (!otpPayload) return null;
    const result = await compareString(input.code, otpPayload.hashOtp);
    return result ? { payload: otpPayload.payload } : null;
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
