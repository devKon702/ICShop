import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // không lưu file ngay
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const singleUpload = (field: string) => upload.single(field);
