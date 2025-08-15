import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { HttpStatus } from "../constants/http-status";
import { failResponse } from "../utils/response";
import { ValidateResponseCode } from "../constants/codes/validate.code";

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      next(err);
    }
  };
};
