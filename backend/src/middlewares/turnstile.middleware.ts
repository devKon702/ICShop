import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/http-status";
import { fail } from "assert";
import { failResponse } from "../utils/response";
import { TurnstileCaptchaService } from "../services/captcha.service";
import { SecurityResponseCode } from "../constants/codes/security.code";

export const verifyTurnstileCaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["CF-Turnstile-Token"] as string | undefined;
  if (!token) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(
        failResponse(
          SecurityResponseCode.MISSING_CAPTCHA,
          "Không tìm thấy token CAPTCHA"
        )
      );
  }
  // Verify captcha
  const captchaService = new TurnstileCaptchaService();
  const isValid = await captchaService.verifyCaptcha(token);
  if (!isValid) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(
        failResponse(
          SecurityResponseCode.INVALID_CAPTCHA,
          "Token CAPTCHA không hợp lệ"
        )
      );
  }
  next();
};
