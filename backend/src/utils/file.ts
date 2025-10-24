import { z, ZodError } from "zod";
import { ValidateResponseCode } from "../constants/codes/validate.code";
import {
  ValidateError,
  ValidateErrorDetailType,
} from "../errors/validate-error";
import { Multer } from "multer";
import storage from "../storage";

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
    let unit = "KB";
    let unitSize = 1024;
    if (options.maxSize >= 1024 * 1024) {
      unit = "MB";
      unitSize *= 1024;
    }
    throw new ValidateError(ValidateResponseCode.OVERSIZE_FILE, [
      {
        field: options.inputField,
        message: `File có kích thước tối đa ${(options.maxSize / unitSize)
          .toFixed(2)
          .replace(/\.00$/, "")} ${unit}`,
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

export const handleImagesUpload = async <T>({
  files,
  fn,
  oldUrls,
  options,
}: {
  files: Express.Multer.File[];
  fn: (newUrls: string[]) => Promise<T>;
  oldUrls: string[];
  options?: { inputField?: string; maxSize?: number };
}) => {
  // Validate files
  files.forEach((file) =>
    validateFile(file, {
      inputField: options?.inputField ?? "file",
      maxSize: options?.maxSize ?? 1024 * 1024,
      type: "image",
    })
  );

  // Get early file urls before save
  const newUrls = files.map((file, index) => {
    const fileName = String(Date.now() + index.toString());
    return storage.getEarlyDir(fileName, file.mimetype);
  });

  // Call fn to handle db update
  const results = await fn(newUrls);

  // Delete old and real save new file
  oldUrls.forEach((url) => storage.delete(url));
  await Promise.all(
    files.map((file, index) =>
      storage.save(file.buffer, newUrls[index].split(".")[0], file.mimetype)
    )
  );
  return results;
};
