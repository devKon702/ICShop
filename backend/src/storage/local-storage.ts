// src/storage/LocalStorage.ts
import { IFileStorage } from "./file-storage.interface";
import fs from "fs/promises";
import path from "path";
import { getFileTail } from "../utils/file";

export class LocalStorage implements IFileStorage {
  private uploadDir: string;

  constructor(uploadDir: string) {
    this.uploadDir = uploadDir;
  }

  async save(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string> {
    const fileType = getFileTail(mimeType);
    const filePath = path.join(this.uploadDir, `${fileName}.${fileType}`);

    // Tạo nếu folder chưa tồn tại
    await fs.mkdir(this.uploadDir, { recursive: true });
    await fs.writeFile(filePath, fileBuffer);
    // Trả về static path để client gọi
    return `${fileName}.${fileType}`;
  }

  async delete(fileUrl: string): Promise<void> {
    const filePath = path.join(this.uploadDir, path.basename(fileUrl));
    await fs.unlink(filePath).catch(() => {}); // ignore nếu không tồn tại
  }
}
