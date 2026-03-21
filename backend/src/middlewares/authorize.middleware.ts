import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error";
import { HttpStatus } from "../constants/http-status";
import { AuthResponseCode } from "../constants/codes/auth.code";
import accountRepository from "../repositories/account.repository";
import { AccessTokenPayloadSchema } from "../schemas/jwt.schema";
import { z } from "zod";

/**
 * Middleware kiểm tra phân quyền, bao gồm tài khoản tồn tại, không bị khóa và thuộc có role hợp lệ
 * @param allowedRoles Mảng các Role hợp lệ
 * @returns
 */
export const authorize = (
  allowedRoles: z.infer<typeof AccessTokenPayloadSchema>["role"][],
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const payload = AccessTokenPayloadSchema.parse(res.locals.auth);

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

    if (
      !allowedRoles.includes(
        account.role as z.infer<typeof AccessTokenPayloadSchema>["role"],
      )
    ) {
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
