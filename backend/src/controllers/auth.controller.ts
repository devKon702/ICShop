import { Request, Response } from "express";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { AuthResponseCode } from "../constants/codes/auth.code";
import {
  forgotPasswordSchema,
  loginSchema,
  loginWithGoogleSchema,
  resetPasswordSchema,
  sendEmailOTPSchema,
  signupSchema,
} from "../schemas/auth.schema";
import { Role } from "../constants/db";
import authService from "../services/auth.service";

class AuthController {
  public login = (role: Role) => async (req: Request, res: Response) => {
    const {
      body: { email, password, captchaToken },
    } = loginSchema.parse(req);

    // Service
    const { accessToken, account } = await authService.login({
      res,
      email,
      password,
      role,
      captchaToken,
    });
    // Response
    const { password: pwd, ...publicAccount } = account;
    res.status(HttpStatus.OK).json(
      successResponse(AuthResponseCode.OK, "Đăng nhập thành công", {
        account: publicAccount,
        token: accessToken,
      })
    );
  };

  public loginWithGoogle = async (req: Request, res: Response) => {
    const {
      body: { token },
    } = loginWithGoogleSchema.parse(req);
    // Service
    const { accessToken, account, isComeback } =
      await authService.loginWithGoogle(res, token);
    // Response
    const { password: pwd, ...publicAccount } = account;
    res.status(isComeback ? HttpStatus.OK : HttpStatus.CREATED).json(
      successResponse(
        isComeback ? AuthResponseCode.OK : AuthResponseCode.SIGN_UP_WITH_GOOGLE,
        isComeback ? "Đăng nhập thành công" : "Tạo tài khoản thành công",
        {
          account: publicAccount,
          token: accessToken,
        }
      )
    );
  };

  public signup = async (req: Request, res: Response) => {
    const {
      body: { email, name, password, phone, otp },
    } = signupSchema.parse(req);
    // Service
    const { password: _, ...newAccount } = await authService.signup({
      email,
      name,
      password,
      phone,
      otp,
    });
    // Response
    res
      .status(HttpStatus.CREATED)
      .json(
        successResponse(
          AuthResponseCode.OK,
          "Tạo tài khoản thành công",
          newAccount
        )
      );
  };

  public logout = async (req: Request, res: Response) => {
    // Service
    await authService.logout(res);
    // Response
    res
      .status(HttpStatus.OK)
      .json(successResponse(AuthResponseCode.OK, "Đăng xuất thành công", null));
  };

  public refresh = async (req: Request, res: Response) => {
    // Service
    const { accessToken } = await authService.refresh(req, res);
    // Response
    res.status(HttpStatus.OK).json(
      successResponse(AuthResponseCode.OK, "Làm mới token thành công", {
        token: accessToken,
      })
    );
  };

  public async sendEmailOTP(req: Request, res: Response) {
    const {
      body: { email, requireExistence },
    } = sendEmailOTPSchema.parse(req);
    // Service
    const { expiresAt } = await authService.sendEmailOtp(
      email,
      requireExistence
    );
    // Response
    res.status(HttpStatus.OK).json(
      successResponse(AuthResponseCode.OK, "Gửi OTP thành công", {
        email,
        expiresAt,
      })
    );
  }

  public async forgotPassword(req: Request, res: Response) {
    const {
      body: { email },
    } = forgotPasswordSchema.parse(req);
    // Service
    await authService.forgotPassword(email);
    // Response
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AuthResponseCode.OK,
          "Nếu email tồn tại, mã đặt lại mật khẩu đã được gửi"
        )
      );
  }

  public async resetPassword(req: Request, res: Response) {
    const {
      body: { email, token, newPassword },
    } = resetPasswordSchema.parse(req);
    // Service
    await authService.resetPassword(email, token, newPassword);
    // Response
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(AuthResponseCode.OK, "Đặt lại mật khẩu thành công")
      );
  }

  testToken(req: Request, res: Response) {
    const payload = res.locals.payload;

    res
      .status(HttpStatus.OK)
      .json(successResponse(AuthResponseCode.OK, "Test auth success", payload));
  }

  async test(req: Request, res: Response) {
    res
      .status(HttpStatus.OK)
      .json(successResponse(AuthResponseCode.OK, "Test success", {}));
  }
}
export default new AuthController();
