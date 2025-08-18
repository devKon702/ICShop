import { ValidateResponseCode } from "../constants/codes/validate.code";
import { HttpStatus } from "../constants/http-status";
import { AppError } from "./app-error";

export type ValidateErrorDetailType = { field: string; message: string };

export class ValidateError extends AppError {
  public errors: ValidateErrorDetailType[];

  constructor(code: ValidateResponseCode, errors: ValidateErrorDetailType[]) {
    super(HttpStatus.BAD_REQUEST, code, "Dữ liệu đầu vào không hợp lệ", true);
    this.errors = errors;
  }
}
