/**
 * @param config Cấu hình
 * @returns
 */
export const generateResetPasswordHtml = (config: {
  /** Tên ứng dụng sẽ hiển thị ở thư cho client */
  appName: string;
  /** Thời gian tồn tại của otp (giây) */
  expiredInSeconds: number;
  /** Đường dẫn đến trang reset password */
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
                  config.expiredInSeconds / 60,
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

/**
 * Hàm tạo mã html chứa otp cho client
 * @param config Cấu hình data gửi html
 * @returns Mã html
 */
export const generateOTPHtml = (config: {
  /** Mã otp gửi cho client */
  otp: string;
  /** Thời gian tồn tại của otp (giây) */
  expiredInSeconds: number;
  /** Tên ứng dụng sẽ hiển thị cho client */
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
                  config.expiredInSeconds / 60,
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

export const generateAdminChangeEmailRequest = (config: {
  appName: string;
  confirmLink: string;
  lockLink: string;
  confirmExpireInMins: number;
  lockExpireHours: number;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirm Email Change</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;">
            <tr>
              <td style="text-align:center;font-size:24px;font-weight:bold;color:#333;">
              ${config.appName}
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px;font-size:18px;color:#333;">
              Xác nhận cập nhật địa chỉ email
              </td>
            </tr>

            <tr>
              <td style="padding-top:10px;color:#555;font-size:14px;line-height:1.6;">
              Có một yêu cầu cập nhật địa chỉ email cho tài khoản ${config.appName} của bạn. Nếu đó là bạn, hãy xác nhận bằng cách ấn vào nút bên dưới
              </td>
            </tr>

            <tr>
              <td style="padding-top:30px;text-align:center;">
                <a href="${config.confirmLink}"
                  style="
                    background:#4CAF50;
                    color:white;
                    padding:12px 24px;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
                    font-weight:bold;
                    margin-right:10px;"    
                >
                Xác nhận
                </a>

                <a href="${config.lockLink}"
                  style="
                    background:#e53935;
                    color:white;
                    padding:12px 24px;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
                    font-weight:bold;"
                >
                Khóa tài khoản
                </a>
              </td>
            </tr>

            <tr>
              <td>
                <p style="font-size:13px;color:#777;">
                Xác nhận hết hạn sau <strong>${config.confirmExpireInMins} phút</strong>.
                </p>
              </td>  
            </tr>
            <tr>
              <td>
                <p style="font-size:13px;color:#777;">
                Khóa tài khoản hết hạn sau <strong>${config.lockExpireHours} giờ</strong>.
                </p>
              </td>  
            </tr>

            <tr>
              <td style="padding-top:30px;font-size:12px;color:#999;line-height:1.5;">
              Nếu bạn không phải người gửi yêu cầu này, mật khẩu của bạn đã bị lộ, hãy khóa tài khoản ngay lập tức.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

export const generateAdminLockAccount = (config: {
  appName: string;
  expiresInHours: number;
  link: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;">
            <tr>
              <td style="text-align:center;font-size:24px;font-weight:bold;color:#333;">
              ${config.appName}
              </td>
            </tr>

            <tr>
              <td style="padding-top:25px;font-size:20px;font-weight:bold;color:#333;">
              Thông báo thay đổi địa chỉ email
              </td>
            </tr>

            <tr>
              <td style="padding-top:15px;font-size:14px;color:#555;line-height:1.6;">
              Địa chỉ email liên kết với tài khoản của bạn vừa thay đổi thành công.
              </td>
            </tr>

            <tr>
              <td style="padding-top:10px;font-size:14px;color:#555;line-height:1.6;">
              Nếu đó là bạn, vui lòng bỏ qua thư này.
              </td>
            </tr>

            <tr>
              <td style="padding-top:10px;font-size:14px;color:#555;line-height:1.6;">
              Nếu bạn <strong>KHÔNG</strong> thực hiện thay đổi này, vui lòng ấn nút bên dưới để nhanh chóng khóa tài khoản của bạn.
              </td>
            </tr>

            <tr>
              <td style="padding-top:30px;text-align:center;">

                <a href="${config.link}"
                  style="
                    background:#e53935;
                    color:white;
                    padding:14px 28px;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:bold;
                    display:inline-block;
                    font-size:15px;"
                >
                Khóa tài khoản
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding-top:25px;font-size:13px;color:#777;">
              Nếu nút phía trên không hoạt động hoặc không hiển thị, vui lòng copy và paste đường link sau vào trình duyệt để khóa tài khoản của bạn:
              </td>
            </tr>

            <tr>
              <td style="padding-top:10px;font-size:13px;color:#555;word-break:break-all;">
              <a href="${config.link}">${config.link}</a>
              </td>
            </tr>

            <tr>
              <td style="padding-top:30px;font-size:12px;color:#999;line-height:1.6;">
              Vì lí do bảo mật, thao tác sẽ hết hạn sau <strong>${config.expiresInHours}</strong> giờ.
              </td>.
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

export const generateAdminConfirmChangePassword = (config: {
  appName: string;
  confirmLink: string;
  lockLink: string;
  expireMinutes: number;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirm Email Change</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;">
            
            <tr>
              <td style="text-align:center;font-size:24px;font-weight:bold;color:#333;">
              ${config.appName}
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px;font-size:18px;color:#333;">
              Xác nhận thay đổi mật khẩu
              </td>
            </tr>

            <tr>
              <td style="padding-top:10px;color:#555;font-size:14px;line-height:1.6;">
              Có một yêu cầu thay đổi mật khẩu cho tài khoản ${config.appName} của bạn. 
              Nếu đó là bạn, hãy xác nhận bằng cách ấn vào nút "Xác nhận" bên dưới.
              </td>
            </tr>

            <tr>
              <td style="padding-top:30px;text-align:center;">
                <a href="${config.confirmLink}"
                  style="
                    background:#4CAF50;
                    color:white;
                    padding:12px 24px;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
                    font-weight:bold;
                    margin-right:10px;">
                Xác nhận
                </a>

                <a href="${config.lockLink}"
                  style="
                    background:#e53935;
                    color:white;
                    padding:12px 24px;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
                    font-weight:bold;">
                Khóa tài khoản
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding-top:25px;font-size:13px;color:#777;line-height:1.6;">
              Nếu các nút trên không hoạt động, hãy sao chép và dán các liên kết sau vào trình duyệt:
              </td>
            </tr>

            <tr>
              <td style="padding-top:10px;font-size:13px;color:#555;word-break:break-all;">
                Xác nhận thay đổi mật khẩu:<br/>
                <a href="${config.confirmLink}" style="color:#1a73e8;">
                  ${config.confirmLink}
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding-top:10px;font-size:13px;color:#555;word-break:break-all;">
                Khóa tài khoản:<br/>
                <a href="${config.lockLink}" style="color:#1a73e8;">
                  ${config.lockLink}
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px;">
                <p style="font-size:13px;color:#777;">
                Thao tác hết hạn sau <strong>${config.expireMinutes} phút</strong>.
                </p>
              </td>  
            </tr>

            <tr>
              <td style="padding-top:10px;font-size:13px;color:#777;">
              Nếu bạn <strong>KHÔNG</strong> phải người gửi yêu cầu này, vui lòng chọn "Khóa tài khoản" <strong>NGAY LẬP TỨC</strong>.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
