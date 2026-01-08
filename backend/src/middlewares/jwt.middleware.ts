import { NextFunction, Request, Response } from "express";
import { JWTError } from "../errors/jwt.error";
import { JWTResponseCode } from "../constants/codes/jwt.code";
import { verifyToken } from "../utils/jwt";
import { AccessTokenPayload } from "../services/jwt.service";
import sessionService from "../services/session.service";
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
    res.locals.auth = payload;
    next();
  } catch (err) {
    next(err);
  }
};

export const validateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = res.locals.auth as AccessTokenPayload;
  const session = await sessionService.getOrLoadSession(
    payload.sessionId,
    payload.role
  );
  if (session?.version !== payload.sessionVersion) {
    // Handle use revoked token logic here
    throw new JWTError(JWTResponseCode.TOKEN_REVOKED, "Token đã bị thu hồi");
  }
  next();
};

export const jwtMiddleware = [verifyAccessToken, validateAccessToken];
