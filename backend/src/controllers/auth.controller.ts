import { Request, Response } from "express";
import accountRepository from "../repositories/account.repository";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { AuthResponseCode } from "../constants/codes/auth.code";
import {
  LoginIType,
  loginSchema,
  sendEmailOTPSchema,
  SignupIType,
  signupSchema,
} from "../schemas/auth.schema";
import { AppError } from "../errors/app-error";
import {
  createAccessToken,
  createRefreshToken,
  verifyToken,
} from "../utils/jwt";
import { compareString, hashString } from "../utils/bcrypt";
import { Role } from "../constants/db";
import { JWTConfig } from "../constants/jwt-config";
import { logger } from "../utils/logger";
import { TokenPayload } from "../types/token-payload";
import { JWTError } from "../errors/jwt-error";
import { JWTResponseCode } from "../constants/codes/jwt.code";
import redis, { redisKeys } from "../utils/redis";
import emailOptService from "../services/email-opt.service";

class AuthController {
  private createCookieToken = (res: Response, token: string, role: Role) => {
    switch (role) {
      // Tạo cookie thường
      case Role.USER:
        res.cookie(JWTConfig.JWT_REFRESH_COOKIE_NAME, token, {
          httpOnly: true,
          path: JWTConfig.JWT_REFRESH_COOKIE_PATH,
          sameSite: "none",
          secure: false,
          maxAge: JWTConfig.JWT_REFRESH_EXPIRE_USER * 1000,
        });
        break;
      case Role.ADMIN:
      default:
        // Tạo session cookie
        res.cookie(JWTConfig.JWT_REFRESH_COOKIE_NAME, token, {
          httpOnly: true,
          sameSite: "none",
          secure: false,
          domain: ".localhost",
          path: JWTConfig.JWT_REFRESH_COOKIE_PATH,
        });
        break;
    }
  };

  public login = (role: Role) => async (req: Request, res: Response) => {
    const {
      body: { email, password },
    } = loginSchema.parse(req);
    const account = await accountRepository.findByEmail(email, role);
    // Không tìm thấy
    if (!account) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AuthResponseCode.NOT_FOUND,
        "Không tìm thấy tài khoản",
        true
      );
    }
    // Sai mật khẩu, bao gồm trường hợp password null với google signup
    if (
      !account.password ||
      !(await compareString(password, account.password))
    ) {
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        AuthResponseCode.WRONG_PASSWORD,
        "Sai mật khẩu",
        true
      );
    }
    // Tài khoản bị khoá
    else if (!account.isActive)
      throw new AppError(
        HttpStatus.FORBIDDEN,
        AuthResponseCode.USER_BLOCKED,
        "Tài khoản đã bị khóa",
        true
      );
    // Thành công
    else {
      const { password, ...publicAccount } = account;
      const accessToken = createAccessToken({
        sub: account.user!.id,
        role,
      });
      const refreshToken = createRefreshToken(
        { sub: account.user!.id, role },
        role
      );
      // Tạo nơi lưu trữ refresh token
      this.createCookieToken(res, refreshToken, role);

      res.status(HttpStatus.OK).json(
        successResponse(AuthResponseCode.OK, "Đăng nhập thành công", {
          account: publicAccount,
          token: accessToken,
        })
      );
    }
  };

  public signup = async (req: Request, res: Response) => {
    const {
      body: { email, name, password, phone },
    } = signupSchema.parse(req);

    const existAccount = await accountRepository.findByEmail(email);
    // Nếu trùng
    if (existAccount)
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        AuthResponseCode.EMAIL_EXIST,
        "Email đã được sử dụng",
        true
      );
    // Không trùng
    const hashedPassword = await hashString(password);
    const { password: passwordIgnored, ...newAccount } =
      await accountRepository.create(email, hashedPassword, name, phone);
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

  public logout = (req: Request, res: Response) => {
    // Xóa cookie, truyền option giống với khi tạo cookie
    res.clearCookie(JWTConfig.JWT_REFRESH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      path: JWTConfig.JWT_REFRESH_COOKIE_PATH,
    });
    // Xóa refresh token trong whitelist
    // ...
    const tokenPayload = res.locals.tokenPayload as TokenPayload;

    logger.info(
      `[${res.locals.requestId}] User [${tokenPayload.sub}] logged out`
    );

    res
      .status(HttpStatus.OK)
      .json(successResponse(AuthResponseCode.OK, "Đăng xuất thành công", null));
  };

  public refresh = async (req: Request, res: Response) => {
    try {
      // Lấy refresh token từ cookie
      const token = req.cookies[JWTConfig.JWT_REFRESH_COOKIE_NAME];
      console.log(req.cookies);
      // Không có token
      if (!token)
        throw new JWTError(
          JWTResponseCode.TOKEN_MISSING,
          "Không tìm thấy token"
        );
      // Xác thực token
      const { sub } = verifyToken(token, "refresh");
      // Kiểm tra blacklist
      // ...
      const account = await accountRepository.findByUserId(sub);
      // Không tìm thấy user
      if (!account)
        throw new JWTError(JWTResponseCode.INVALID_TOKEN, "Token không hợp lệ");
      // Tài khoản bị khóa
      if (!account.isActive)
        throw new AppError(
          HttpStatus.FORBIDDEN,
          AuthResponseCode.USER_BLOCKED,
          "Tài khoản đã bị khóa",
          true
        );
      // Xác thực thành công -> refresh
      const accessToken = createAccessToken({
        sub,
        role: account.role as Role,
      });
      const refreshToken = createRefreshToken(
        { sub, role: account.role as Role },
        account.role as Role
      );
      // Tạo nơi lưu trữ refresh token
      this.createCookieToken(res, refreshToken, account.role as Role);

      res.status(HttpStatus.OK).json(
        successResponse(AuthResponseCode.OK, "Làm mới token thành công", {
          token: accessToken,
        })
      );
    } catch (err) {
      throw err;
    }
  };

  public async sendEmailOTP(req: Request, res: Response) {
    const {
      body: { email },
    } = sendEmailOTPSchema.parse(req);
    const otp = emailOptService.generateOTP(6);
    const expiredInSeconds = 5 * 60; // 5 minutes
    // Save and send OTP
    await Promise.all([
      emailOptService.save(email, otp, expiredInSeconds),
      emailOptService.send(email, otp, expiredInSeconds),
    ]);
    const expiredAt = new Date(Date.now() + expiredInSeconds * 1000);
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
