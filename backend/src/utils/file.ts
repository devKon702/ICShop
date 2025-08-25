import { z, ZodError } from "zod";
import { ValidateResponseCode } from "../constants/codes/validate.code";
import {
  ValidateError,
  ValidateErrorDetailType,
} from "../errors/validate-error";
import { Multer } from "multer";

const imageSupportedType = ["image/jpg", "image/jpeg"];
const videoSupportedType = ["video/mp4"];

export const validateFile = (
  file: Express.Multer.File | undefined,
  options: {
    inputField: string;
    maxSize: number;
    type: "image" | "video";
  }
) => {
  // Kiểm tra file tồn tại
  if (!file)
    throw new ValidateError(ValidateResponseCode.INVALID_FILE, [
      { field: options.inputField, message: "Không tìm thấy file" },
    ]);

  // Kiểm tra định dạng
  const supportedFile =
    options.type === "image" ? imageSupportedType : videoSupportedType;
  if (!supportedFile.includes(file.mimetype))
    throw new ValidateError(ValidateResponseCode.UNSUPPORTED_FILE, [
      {
        field: options.inputField,
        message: `File phải có định dạng ${supportedFile.join(", ")}`,
      },
    ]);

  // Kiểm tra kích thước
  if (options.maxSize < file.size) {
    throw new ValidateError(ValidateResponseCode.OVERSIZE_FILE, [
      {
        field: options.inputField,
        message: `File có kích thước tối đa ${Math.floor(
          options.maxSize / (1024 * 1024)
        )} MB`,
      },
    ]);
  }
};

export const getFileTail = (mimeType: string) => {
  return mimeType.split("/").pop() ?? "";
};

export const getFileName = (serveUrl: string) => {
  return serveUrl.split("/").pop() ?? "";
};
