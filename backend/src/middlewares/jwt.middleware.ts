import { NextFunction, Request, Response } from "express";
import { JWTError } from "../errors/jwt-error";
import { JWTResponseCode } from "../constants/codes/jwt.code";
import { verifyToken } from "../utils/jwt";
export const verifyAccessToken = (
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
    const payload = verifyToken(token, "access");

    // Kiểm tra tài khoản có hiệu lực - kiểm tra blacklist
    /// ...

    res.locals.tokenPayload = payload;
    next();
  } catch (err) {
    next(err);
  }
};

export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
