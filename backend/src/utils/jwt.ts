import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { JWT_ACCESS_KEY, JWT_REFRESH_KEY } from "../constants/env";
import { TokenPayload } from "../types/token-payload";
import { Role } from "../constants/db";
import { JWTConfig } from "../constants/jwt";
import { JWTError } from "../errors/jwt-error";
import { JWTResponseCode } from "../constants/codes/jwt.code";

export const createAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_ACCESS_KEY as string, {
    expiresIn: JWTConfig.JWT_ACCESS_EXPIRE,
  });
};

export const createRefreshToken = (payload: TokenPayload, role: Role) => {
  const expiresIn =
    role === Role.USER
      ? JWTConfig.JWT_REFRESH_EXPIRE_USER
      : JWTConfig.JWT_REFRESH_EXPIRE_ADMIN;
  return jwt.sign(payload, JWT_REFRESH_KEY as string, {
    expiresIn,
  });
};

export const verifyToken = (
  token: string,
  type: "access" | "refresh" = "access"
) => {
  const key = type === "access" ? JWT_ACCESS_KEY : JWT_REFRESH_KEY;

  try {
    const payload = jwt.verify(token, key!) as TokenPayload;
    return payload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new JWTError(JWTResponseCode.TOKEN_EXPIRED, "Token hết hạn");
    }
    // Token không hợp lệ
    if (err instanceof JsonWebTokenError) {
      throw new JWTError(JWTResponseCode.INVALID_TOKEN, "Token không hợp lệ");
    }

    throw err;
  }
};
