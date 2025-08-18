import jwt from "jsonwebtoken";
import { JWT_ACCESS_KEY, JWT_REFRESH_KEY } from "../constants/env";
import { JwtPayload } from "../types/jwt-payload";
import { Role } from "../constants/db";
import { JWTConfig } from "../constants/jwt";

export const createAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_ACCESS_KEY as string, {
    expiresIn: JWTConfig.JWT_ACCESS_EXPIRE,
  });
};

export const createRefreshToken = (payload: JwtPayload, role: Role) => {
  const expiresIn =
    role === Role.USER
      ? JWTConfig.JWT_REFRESH_EXPIRE_USER
      : JWTConfig.JWT_REFRESH_EXPIRE_ADMIN;
  return jwt.sign(payload, JWT_REFRESH_KEY as string, {
    expiresIn,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_ACCESS_KEY!);
};
