import { env } from "../../constants/env";
import { generateOTPHtml } from "../../utils/html.util";
import { OtpPolicy, OtpPurpose } from "./otp.type";

export const OtpPolicies = {
  REGISTER: {
    ttlMs: 5 * 60_000,
    channels: ["EMAIL"],
    templates: {
      EMAIL: (ttlMinutes, code) =>
        generateOTPHtml({
          appName: env.APP_NAME,
          expiredInSeconds: ttlMinutes * 60,
          otp: code,
        }),
    },
  },
  CHANGE_EMAIL: {
    ttlMs: 5 * 60_000,
    channels: ["EMAIL"],
    templates: {
      EMAIL: (ttlMinutes, code) =>
        generateOTPHtml({
          appName: env.APP_NAME,
          expiredInSeconds: ttlMinutes * 60,
          otp: code,
        }),
    },
  },
} satisfies Record<OtpPurpose, OtpPolicy>;
