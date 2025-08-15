// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../constants/http-status";
import { ResponseObject } from "../models/response";
import { ZodError } from "zod";
import { failResponse } from "../utils/response";
import { ValidateResponseCode } from "../constants/codes/validate.code";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/app-error";
import { fail } from "assert";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err);

  // 1. Zod validation error
  if (err instanceof ZodError) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json(
        failResponse(ValidateResponseCode.INVALID_INPUT, "Tham số không hợp lệ")
      );
    return;
  }

  // 2. Prisma errors
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

  // 3. Custom AppError
  if (err instanceof AppError && err.isOperational) {
    res.status(err.htttpCode).json(failResponse(err.code, err.message));
  }

  // 4. Fallback - Unknown error
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json(failResponse("ERROR", "Internal Server Error"));
}
