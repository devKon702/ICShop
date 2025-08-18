import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { JWTError } from "../errors/jwt-error";
import { JWTResponseCode } from "../constants/codes/jwt.code";
import { verifyAccessToken } from "../utils/jwt";
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ") || !auth.split(" ")[1]) {
    return next(
      new JWTError(JWTResponseCode.TOKEN_MISSING, "Không tìm thấy token")
    );
  }
  // Lấy token từ bearer token
  const token = auth.split(" ")[1];

  try {
    // Xác thực và lấy payload từ token
    const payload = verifyAccessToken(token);

    // Kiểm tra tài khoản có hiệu lực - kiểm tra blacklist
    /// ...

    res.locals.tokenPayload = payload;
    next();
  } catch (err) {
    // Token hết hạn
    if (err instanceof TokenExpiredError) {
      return next(new JWTError(JWTResponseCode.TOKEN_EXPIRED, "Token hết hạn"));
    }
    // Token không hợp lệ
    if (err instanceof JsonWebTokenError) {
      return next(
        new JWTError(JWTResponseCode.INVALID_TOKEN, "Token không hợp lệ")
      );
    }

    next(err);
  }
};
