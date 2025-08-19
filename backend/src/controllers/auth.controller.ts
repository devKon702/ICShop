import { Request, Response } from "express";
import accountRepository from "../repositories/account.repository";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { AuthResponseCode } from "../constants/codes/auth.code";
import { LoginIType, SignupIType } from "../schemas/auth.schema";
import { AppError } from "../errors/app-error";
import {
  createAccessToken,
  createRefreshToken,
  verifyToken,
} from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { Role } from "../constants/db";
import { JWTConfig } from "../constants/jwt";
import { logger } from "../utils/logger";
import { TokenPayload } from "../types/token-payload";
import { JWTError } from "../errors/jwt-error";
import { JWTResponseCode } from "../constants/codes/jwt.code";

class AuthController {
  private createCookieToken = (res: Response, token: string, role: Role) => {
    switch (role) {
      // Tạo cookie thường
      case Role.USER:
        res.cookie(JWTConfig.JWT_REFRESH_COOKIE_NAME, token, {
          httpOnly: true,
          sameSite: "strict",
          path: JWTConfig.JWT_REFRESH_COOKIE_PATH,
          expires: new Date(
            Date.now() + JWTConfig.JWT_REFRESH_EXPIRE_USER * 1000
          ),
        });
        break;
      case Role.ADMIN:
      default:
        // Tạo session cookie
        res.cookie(JWTConfig.JWT_REFRESH_COOKIE_NAME, token, {
          httpOnly: true,
          sameSite: "strict",
          path: JWTConfig.JWT_REFRESH_COOKIE_PATH,
        });
        break;
    }
  };

  public login = async (
    req: Request<any, any, LoginIType["body"]>,
    res: Response
  ) => {
    try {
      const { email, password } = req.body;
      const account = await accountRepository.findByEmail(email);
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
        !(await comparePassword(password, account.password))
      ) {
        Role;
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
        const {
          password,
          version,
          createdAt,
          updatedAt,
          modifierId,
          creatorId,
          ...publicAccount
        } = account;
        const accessToken = createAccessToken({
          sub: account.user!.id,
          role: account.role as Role,
        });
        const refreshToken = createRefreshToken(
          { sub: account.user!.id, role: account.role as Role },
          account.role as Role
        );
        // Tạo nơi lưu trữ refresh token
        this.createCookieToken(res, refreshToken, account.role as Role);

        res.status(HttpStatus.OK).json(
          successResponse(AuthResponseCode.OK, "Đăng nhập thành công", {
            account: publicAccount,
            token: accessToken,
          })
        );
      }
    } catch (err) {
      throw err;
    }
  };

  public signup = async (
    req: Request<any, any, SignupIType["body"]>,
    res: Response
  ) => {
    try {
      const { email, password, name } = req.body;

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
      const hashedPassword = await hashPassword(password);
      const { password: passwordIgnored, ...newAccount } =
        await accountRepository.createAccount(email, hashedPassword, name);
      res
        .status(HttpStatus.CREATED)
        .json(
          successResponse(
            AuthResponseCode.OK,
            "Tạo tài khoản thành công",
            newAccount
          )
        );
    } catch (err) {
      throw err;
    }
  };

  public logout = (req: Request, res: Response) => {
    // Xóa cookie, truyền option giống với khi tạo cookie
    res.clearCookie(JWTConfig.JWT_REFRESH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: "strict",
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
      const user = await accountRepository.findByUserId(sub);
      // Không tìm thấy user
      if (!user)
        throw new JWTError(JWTResponseCode.INVALID_TOKEN, "Token không hợp lệ");
      // Tài khoản bị khóa
      if (!user.account.isActive)
        throw new AppError(
          HttpStatus.FORBIDDEN,
          AuthResponseCode.USER_BLOCKED,
          "Tài khoản đã bị khóa",
          true
        );
      // Xác thực thành công -> refresh
      const accessToken = createAccessToken({
        sub,
        role: user.account.role as Role,
      });
      const refreshToken = createRefreshToken(
        { sub, role: user.account.role as Role },
        user.account.role as Role
      );
      // Tạo nơi lưu trữ refresh token
      this.createCookieToken(res, refreshToken, user.account.role as Role);

      res
        .status(HttpStatus.OK)
        .json(
          successResponse(
            AuthResponseCode.OK,
            "Làm mới token thành công",
            accessToken
          )
        );
    } catch (err) {
      throw err;
    }
  };

  test(req: Request, res: Response) {
    const payload = res.locals.payload;
    res
      .status(HttpStatus.OK)
      .json(successResponse(AuthResponseCode.OK, "Test auth success", payload));
  }
}
export default new AuthController();
