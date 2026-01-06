export const generateResetPasswordHtml = (config: {
  appName: string;
  expiredInSeconds: number;
  resetLink: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
  	<meta charset="UTF-8" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Đặt lại mật khẩu</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f5f6f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Helvetica, Arial, sans-serif;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #f5f6f8; padding: 40px 0;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="480"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="background: #ffffff; border-radius: 10px; padding: 40px;"
          >
            <tr>
              <td style="font-size: 24px; font-weight: bold; color: #111;">
                Đặt lại mật khẩu
              </td>
            </tr>
            <tr>
              <td style="padding-top: 20px; font-size: 15px; color: #444;">
                Ai đó đã gửi yêu cầu để đặt lại mật khẩu cho tài khoản ${
                  config.appName
                } của bạn.
                </td>
            </tr>
            <tr>
              <td style="padding-top: 10px; font-size: 15px; color: #444;">
                Nhấn vào nút bên dưới để chuyển đến trang đặt lại mật khẩu cho tài khoản của bạn.
              </td>
            </tr>
            <tr>
              <td style="padding-top: 10px; font-size: 15px; color: #444;">
                Thao tác có hiệu lực trong <strong>${Math.floor(
                  config.expiredInSeconds / 60
                )} phút.</strong>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top: 30px; padding-bottom: 30px;">
                <a
                  href="${config.resetLink}"
                  style="
                    background-color: #007bff;
                    color: white;
                    text-decoration: none;
                    padding: 12px 22px;
                    border-radius: 6px;
                    font-size: 16px;
                    display: inline-block;
                  "
                >
                  Chuyển tiếp
                </a>
              </td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #555;">
                Nếu bạn không phải người gửi yêu cầu, hãy bỏ qua thư này.
              </td>
            </tr>
          </table>
          <div
            style="
              font-size: 12px;
              color: #999;
              margin-top: 20px;
              text-align: center;
            "
          >
            © ${new Date().getFullYear()} ${
    config.appName
  }. All rights reserved.
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

export const generateOTPHtml = (config: {
  otp: string;
  expiredInSeconds: number;
  appName: string;
}) => {
  return `
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
};
