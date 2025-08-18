// src/storage/LocalStorage.ts
import { IFileStorage } from "./file-storage.interface";
import fs from "fs/promises";
import path from "path";

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
    const filePath = path.join(this.uploadDir, fileName);
    await fs.writeFile(filePath, fileBuffer);
    // Trả về URL để client dùng, giả sử static được serve ở /uploads
    return `/uploads/${fileName}`;
  }

  async delete(fileUrl: string): Promise<void> {
    const filePath = path.join(this.uploadDir, path.basename(fileUrl));
    await fs.unlink(filePath).catch(() => {}); // ignore nếu không tồn tại
  }
}
