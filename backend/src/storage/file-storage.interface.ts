export interface IFileStorage {
  save(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string>;
  delete(fileUrl: string): Promise<void>;
  getEarlyDir(fileName: string, mimeType: string): string;
}
