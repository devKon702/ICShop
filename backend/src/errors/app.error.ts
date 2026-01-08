export class AppError extends Error {
  public htttpCode: number; // Mã http cho response
  public code: string; // Mã lỗi cụ thể hiển thị cho client
  public isOperational: boolean; // true - lỗi xác định, false - lỗi hệ thống, ko xác định
  constructor(
    httpCode: number,
    code: string,
    message: string,
    isOperational: boolean
  ) {
    super(message);
    this.htttpCode = httpCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
