const JWT = {
  JWT_ACCESS_EXPIRE: 15 * 60 * 60 * 1000, // 15m
  JWT_REFRESH_EXPIRE_USER: 30 * 24 * 60 * 60 * 60 * 1000, // 30d
  JWT_REFRESH_EXPIRE_ADMIN: 12 * 60 * 60 * 60 * 1000, //12h
};

export default JWT;
