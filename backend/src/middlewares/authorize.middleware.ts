import { NextFunction, Request, Response } from "express";
import { TokenPayload } from "../types/token-payload";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";
import { AuthResponseCode } from "../constants/codes/auth.code";

export const authorize = (allowedRoles: TokenPayload["role"][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const payload = res.locals.tokenPayload as TokenPayload;

    if (!allowedRoles.includes(payload.role)) {
      return next(
        new AppError(
          HttpStatus.FORBIDDEN,
          AuthResponseCode.FORBIDDEN,
          "Không đủ quyền để thực hiện",
          true
        )
      );
    }

    next();
  };
};
