import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { HttpStatus } from "../constants/http-status";
import { failResponse } from "../utils/response";
import { ValidateResponseCode } from "../constants/codes/validate.code";
import {
  ValidateError,
  ValidateErrorDetailType,
} from "../errors/validate.error";

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // KIểm tra input với zod
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // Tạo mảng đối tượng thông tin error cho response
        const detail: ValidateErrorDetailType[] = err.errors.map((item) => ({
          field: item.path.join("."),
          message: item.message,
        }));
        return next(
          new ValidateError(ValidateResponseCode.INVALID_INPUT, detail)
        );
      }
      next(err);
    }
  };
};
