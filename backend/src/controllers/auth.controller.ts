import { Request, Response } from "express";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { AuthResponseCode } from "../constants/codes/auth.code";
import {
  loginSchema,
  loginWithGoogleSchema,
  sendEmailOTPSchema,
  signupSchema,
} from "../schemas/auth.schema";
import { Role } from "../constants/db";
import emailOptService from "../services/email-opt.service";
import authService from "../services/auth.service";

class AuthController {
  public login = (role: Role) => async (req: Request, res: Response) => {
    const {
      body: { email, password },
    } = loginSchema.parse(req);

    // Service
    const { accessToken, account } = await authService.login(
      res,
      email,
      password,
      role
    );
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
      body: { email, name, password, phone },
    } = signupSchema.parse(req);
    // Service
    const { password: _, ...newAccount } = await authService.signup({
      email,
      name,
      password,
      phone,
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
      body: { email },
    } = sendEmailOTPSchema.parse(req);
    // Service
    const { expiredAt } = await authService.sendEmailOtp(email);
    // Response
    res.status(HttpStatus.OK).json(
      successResponse(AuthResponseCode.OK, "Gửi OTP thành công", {
        email,
        expiredAt,
      })
    );
  }

  test(req: Request, res: Response) {
    const payload = res.locals.payload;

    res
      .status(HttpStatus.OK)
      .json(successResponse(AuthResponseCode.OK, "Test auth success", payload));
  }

  async testRedis(req: Request, res: Response) {
    const email = "nhatkha117@gmail.com";
    const otp = emailOptService.generateOTP(6);
    const expiredInSeconds = 5 * 60; // 5 minutes
    await Promise.all([
      emailOptService.save(email, otp, expiredInSeconds),
      emailOptService.send(email, otp, expiredInSeconds),
    ]);
    const expiredAt = new Date(Date.now() + expiredInSeconds * 1000);
    res.status(HttpStatus.OK).json(
      successResponse(AuthResponseCode.OK, "Send OTP success", {
        email,
        expiredAt,
      })
    );
  }
}
export default new AuthController();
