import { env } from "./env";

export const JWTConfig = {
  JWT_ACCESS_KEY: env.JWT_ACCESS_KEY,
  JWT_REFRESH_KEY: env.JWT_REFRESH_KEY,
  JWT_ACCESS_EXPIRE_USER: 15 * 60, // 15m
  JWT_ACCESS_EXPIRE_ADMIN: 5 * 60, // 5m
  JWT_REFRESH_EXPIRE_USER: 7 * 24 * 60 * 60, // 7d
  JWT_REFRESH_EXPIRE_ADMIN: 12 * 60 * 60, //12h
  JWT_REFRESH_COOKIE_NAME: "refreshToken",
  JWT_REFRESH_COOKIE_PATH: "/api/v1/auth/refresh",
} as const;
