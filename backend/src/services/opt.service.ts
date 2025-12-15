import crypto from "crypto";
import { compareString, hashString } from "../utils/bcrypt";
import redis, { redisKeys } from "../utils/redis";
import mailService from "./mail.service";
import { env } from "../constants/env";
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
    const config = {
      otp: code,
      expiredInSeconds,
      appName: env.APP_NAME,
    };
    const html = `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Xác thực email</title>
  </head>

  <body style="margin:0;padding:0;background-color:#f5f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f6f8;padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;padding:40px;">
            <tr>
              <td style="font-size:24px;font-weight:600;color:#111;">
                Xác thực email
              </td>
            </tr>

            <tr>
              <td style="padding-top:8px;font-size:15px;color:#444;">
                Vui lòng nhập mã OTP bên dưới để xác thực địa chỉ email của bạn.
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:28px 0;">
                <div
                  style="
                    display:inline-block;
                    padding:14px 28px;
                    background-color:#f1f3f5;
                    border-radius:8px;
                    font-size:28px;
                    font-weight:700;
                    letter-spacing:6px;
                    color:#111;
                  "
                >
                  ${config.otp}
                </div>
              </td>
            </tr>

            <tr>
              <td style="font-size:14px;color:#555;">
                Mã OTP có hiệu lực trong
                <strong>${Math.floor(
                  config.expiredInSeconds / 60
                )} phút</strong>.
                Không chia sẻ mã này cho bất kỳ ai.
              </td>
            </tr>
            <tr>
              <td style="padding-top:16px;font-size:14px;color:#555;">
                Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua thư này.
              </td>
            </tr>
          </table>
          <div style="font-size:12px;color:#999;margin-top:20px;text-align:center;">
            © ${new Date().getFullYear()} ${
      config.appName
    }. All rights reserved.
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
    await mailService.send({
      to: email,
      subject: `${env.APP_NAME} - Mã OTP xác thực email`,
      html,
    });
  }
}

export default new OTPService();
