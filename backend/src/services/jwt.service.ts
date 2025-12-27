import { Role } from "../constants/db";
import { env } from "../constants/env";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { JWTConfig } from "../constants/jwt-config";
import { JWTError } from "../errors/jwt-error";
import { JWTResponseCode } from "../constants/codes/jwt.code";

export interface RefreshTokenPayload {
  jti: string;
  sub: number;
  role: Role;
  sessionId: string;
  version: number;
}

export interface AccessTokenPayload {
  sub: number;
  role: Role;
  sessionId: string;
  sessionVersion: number;
}

class JwtService {
  public createAccessToken = (
    payload: AccessTokenPayload
  ): { token: string; expiresAt: number } => {
    const expiresIn =
      payload.role === Role.USER
        ? JWTConfig.JWT_ACCESS_EXPIRE_USER
        : JWTConfig.JWT_ACCESS_EXPIRE_ADMIN;
    return {
      token: jwt.sign(payload, env.JWT_ACCESS_KEY, {
        expiresIn,
      }),
      expiresAt: Date.now() + expiresIn * 1000, // milliseconds
    };
  };

  public createRefreshToken = (
    payload: RefreshTokenPayload
  ): { token: string; expiresAt: number } => {
    const expiresIn =
      payload.role === Role.USER
        ? JWTConfig.JWT_REFRESH_EXPIRE_USER
        : JWTConfig.JWT_REFRESH_EXPIRE_ADMIN;
    return {
      token: jwt.sign(payload, env.JWT_REFRESH_KEY, {
        expiresIn,
      }),
      expiresAt: Date.now() + expiresIn * 1000, // milliseconds
    };
  };

  public verifyAccessToken = (token: string): AccessTokenPayload => {
    try {
      const payload = jwt.verify(
        token,
        env.JWT_ACCESS_KEY
      ) as AccessTokenPayload;
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

  public verifyRefreshToken = (token: string): RefreshTokenPayload => {
    try {
      const payload = jwt.verify(
        token,
        env.JWT_REFRESH_KEY
      ) as RefreshTokenPayload;
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
}

export default new JwtService();
