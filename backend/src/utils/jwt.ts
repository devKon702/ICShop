import jwt from "jsonwebtoken";
import { JWT_ACCESS_KEY, JWT_REFRESH_KEY } from "../constants/env";
import JWT from "../constants/jwt";

export const createAccessToken = (payload: any) => {
  return jwt.sign(payload, JWT_ACCESS_KEY as string, {
    expiresIn: JWT.JWT_ACCESS_EXPIRE,
  });
};

export const createRefreshToken = (payload: any, role: "user" | "admin") => {
  const expiresIn =
    role === "user"
      ? JWT.JWT_REFRESH_EXPIRE_USER
      : JWT.JWT_REFRESH_EXPIRE_ADMIN;
  return jwt.sign(payload, JWT_REFRESH_KEY as string, {
    expiresIn,
  });
};
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_ACCESS_KEY as string);
};
