import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../constants/http-status";
import { failResponse } from "../utils/response";
import { AppError } from "../errors/app-error";
import { logger } from "../utils/logger";
import { ValidateError } from "../errors/validate-error";
import { JWTError } from "../errors/jwt-error";

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
  // if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //   // Lỗi unique constraint
  //   if (err.code === "P2002") {
  //     res.status(409).json({
  //       status: "fail",
  //       message: `Field(s) ${err.meta?.target} must be unique`,
  //     });
  //     return;
  //   }

  //   // Record not found
  //   if (err.code === "P2025") {
  //     return res.status(404).json({
  //       status: "fail",
  //       message: "Record not found",
  //     });
  //   }

  //   return res.status(400).json({
  //     status: "fail",
  //     message: `Database error: ${err.message}`,
  //   });
  // }

  // Fallback - Unknown error
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json(failResponse("ERROR", "Internal Server Error"));
  logger.error(`[${res.locals.requestId}] Unknown Error`, err);
}
