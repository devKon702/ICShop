import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = uuidv4();
  res.locals.requestId = requestId;

  logger.info(`[${requestId}] ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    logger.info(`[${requestId}] ${res.statusCode} ${req.originalUrl}`);
  });
  next();
};
