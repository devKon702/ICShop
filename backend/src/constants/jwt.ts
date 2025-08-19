export const JWTConfig = {
  JWT_ACCESS_EXPIRE: 15 * 60 * 60, // 15m
  JWT_REFRESH_EXPIRE_USER: 7 * 24 * 60 * 60, // 7d
  JWT_REFRESH_EXPIRE_ADMIN: 12 * 60 * 60, //12h
  JWT_REFRESH_COOKIE_NAME: "refreshToken",
  JWT_REFRESH_COOKIE_PATH: "/api/v1/auth/refresh",
};
