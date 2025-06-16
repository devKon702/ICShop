// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../constants/http-status";
import { ResponseObject } from "../models/response";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  res
    .status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
    .json(
      new ResponseObject(
        HttpStatus.INTERNAL_SERVER_ERROR,
        err.message || "Internal Server Error",
        null
      )
    );
}
