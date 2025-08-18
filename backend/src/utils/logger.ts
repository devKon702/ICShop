import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { NODE_ENV } from "../constants/env";

const { combine, timestamp, printf, align, colorize, errors, json } =
  winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// log level: error > warn > info > http > verbose > debug > silly

export const logger = winston.createLogger({
  level: NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm::ss.SSS" }),
    errors({ stack: true })
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), align(), logFormat),
    }),
    new DailyRotateFile({
      filename: "logs/%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      format: json(), // log file ở dạng JSON
    }),
  ],
});
