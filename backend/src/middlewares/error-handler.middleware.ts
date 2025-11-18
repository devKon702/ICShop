import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../constants/http-status";
import { failResponse } from "../utils/response";
import { AppError } from "../errors/app-error";
import { logger } from "../utils/logger";
import { ValidateError } from "../errors/validate-error";
import { JWTError } from "../errors/jwt-error";
import { Prisma } from "@prisma/client";
import { DBResponseCode } from "../constants/codes/db.code";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Lỗi nghiệp vụ
  if (err instanceof AppError && err.isOperational) {
    logger.info(`[${res.locals.requestId}] ${err.message}`);
    // JWT Error
    if (err instanceof JWTError) {
      res.status(err.htttpCode).json(failResponse(err.code, err.message));
      return;
    }

    // Validation Error
    if (err instanceof ValidateError) {
      res
        .status(err.htttpCode)
        .json(failResponse(err.code, err.message, err.errors));
      return;
    }

    // Other App Error
    res.status(err.htttpCode).json(failResponse(err.code, err.message));
    return;
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(`[${res.locals.requestId}] Prisma Error`, err);
    // Unique constraint
    if (err.code === "P2002") {
      res
        .status(HttpStatus.CONFLICT)
        .json(
          failResponse(
            DBResponseCode.CONFLICT_UNIQUE_KEY,
            "Dữ liệu bị trùng lặp"
          )
        );
      return;
    }
    // FK Error
    if (err.code === "P2003") {
      res
        .status(HttpStatus.CONFLICT)
        .json(failResponse(DBResponseCode.CONFLICT_FK, "Lỗi dữ liệu liên kết"));
      return;
    }

    // Record not found
    if (err.code === "P2025") {
      res
        .status(HttpStatus.CONFLICT)
        .json(failResponse(DBResponseCode.NOT_FOUND, "Không tìm thấy dữ liệu"));
      return;
    }
  }

  // Fallback - Unknown error
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json(failResponse("ERROR", "Internal Server Error"));
  logger.error(`[${res.locals.requestId}] Unknown Error`, err);
}
