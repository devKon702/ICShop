import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_KEY } from "../constants/env";
import { failResponse, successResponse } from "../utils/response";
import { HttpStatus } from "../constants/http-status";
import { AuthResponseCode } from "../constants/codes/auth.code";

class AuthMiddleware {
  verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ") || !auth.split(" ")[1]) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json(failResponse(AuthResponseCode.TOKEN_MISSING, "Missing token"));
      return;
    }

    const token = auth.split(" ")[1];
    jwt.verify(token, JWT_ACCESS_KEY as string, (err, payload) => {
      if (err)
        return res
          .status(HttpStatus.FORBIDDEN)
          .json(failResponse(AuthResponseCode.INVALID_TOKEN, "Invalid token"));
      res.locals.user = payload; // { id, role }
      next();
    });
    next();
  };
}

export default new AuthMiddleware();
