import { env } from "../../constants/env";
import { generateOTPHtml } from "../../utils/html.util";
import { OtpChannel, OtpPurpose } from "./otp.constant";

export type OtpPolicy = {
  /** Thời gian sống của otp (seconds) */
  ttlSecs: number;
  /** Kênh gửi otp */
  channels: OtpChannel[];
  /** Mục đích xác thực OTP */
  purpose: OtpPurpose;
  /** Object chứa định dạng thư hiển thị cho client theo từng channel */
  templates: Partial<{
    [K in OtpChannel]: (ttlMinutes: number, code: string) => string;
  }>;
};

export const otpPolicies = {
  REGISTER: {
    ttlSecs: 5 * 60,
    channels: [OtpChannel.EMAIL],
    purpose: OtpPurpose.REGISTER,
    templates: {
      EMAIL: (ttlSecs, code) =>
        generateOTPHtml({
          appName: env.APP_NAME,
          expiredInSeconds: ttlSecs,
          otp: code,
        }),
    },
  },
  CHANGE_EMAIL: {
    ttlSecs: 5 * 60,
    channels: [OtpChannel.EMAIL],
    purpose: OtpPurpose.CHANGE_EMAIL,
    templates: {
      EMAIL: (ttlSecs, code) =>
        generateOTPHtml({
          appName: env.APP_NAME,
          expiredInSeconds: ttlSecs,
          otp: code,
        }),
    },
  },
} satisfies Record<OtpPurpose, OtpPolicy>;
