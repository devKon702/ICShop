import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error";
import { HttpStatus } from "../constants/http-status";
import { AuthResponseCode } from "../constants/codes/auth.code";
import { AccessTokenPayload } from "../services/jwt.service";
import accountRepository from "../repositories/account.repository";

/**
 * Middleware kiểm tra phân quyền, bao gồm tài khoản tồn tại, không bị khóa và thuộc có role hợp lệ
 * @param allowedRoles Mảng các Role hợp lệ
 * @returns
 */
export const authorize = (allowedRoles: AccessTokenPayload["role"][]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const payload = res.locals.auth as AccessTokenPayload;

    const account = await accountRepository.findByUserId(payload.sub);
    if (!account) {
      return next(
        new AppError(
          HttpStatus.UNAUTHORIZED,
          AuthResponseCode.NOT_FOUND,
          "Tài khoản không tồn tại",
          true,
        ),
      );
    }
    if (!account?.isActive) {
      return next(
        new AppError(
          HttpStatus.FORBIDDEN,
          AuthResponseCode.USER_BLOCKED,
          "Tài khoản đã bị khóa",
          true,
        ),
      );
    }

    if (!allowedRoles.includes(account.role as AccessTokenPayload["role"])) {
      return next(
        new AppError(
          HttpStatus.FORBIDDEN,
          AuthResponseCode.FORBIDDEN,
          "Không đủ quyền để thực hiện",
          true,
        ),
      );
    }

    next();
  };
};
