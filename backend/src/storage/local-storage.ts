// src/storage/LocalStorage.ts
import { IFileStorage } from "./file-storage.interface";
import fs from "fs/promises";
import path from "path";
import { getFileTail } from "../utils/file";
import { env } from "../constants/env";

export class LocalStorage implements IFileStorage {
  private storagePath: string;

  constructor(uploadDir: string) {
    this.storagePath = uploadDir;
  }

  async save(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string> {
    const fileType = getFileTail(mimeType);
    const filePath = path.join(this.storagePath, `${fileName}.${fileType}`);

    // Tạo nếu folder chưa tồn tại
    await fs.mkdir(this.storagePath, { recursive: true });
    await fs.writeFile(filePath, fileBuffer);
    // Trả về serve url để client gọi - http url nên không dùng path được
    // return `${env.SERVE_DIR}/${fileName}.${fileType}`;
    return this.getEarlyDir(fileName, mimeType);
  }

  async delete(fileUrl: string): Promise<void> {
    const filePath = path.join(this.storagePath, path.basename(fileUrl));
    await fs.unlink(filePath).catch(() => {}); // ignore nếu không tồn tại
  }

  getEarlyDir(fileName: string, mimeType: string): string {
    return `${fileName}.${getFileTail(mimeType)}`;
  }
}
