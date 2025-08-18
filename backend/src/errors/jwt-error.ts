import { JWTResponseCode } from "../constants/codes/jwt.code";
import { HttpStatus } from "../constants/http-status";
import { AppError } from "./app-error";

export class JWTError extends AppError {
  constructor(code: JWTResponseCode, message: string) {
    super(HttpStatus.UNAUTHORIZED, code, message, true);
  }
}
