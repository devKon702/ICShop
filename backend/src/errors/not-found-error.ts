import { HttpStatus } from "../constants/http-status";
import { AppError } from "./app-error";

export class NotFoundError extends AppError {
  constructor(code: string, message?: string) {
    super(
      HttpStatus.NOT_FOUND,
      code,
      message || "Không tìm thấy dữ liệu",
      true
    );
  }
}
