import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: `.env` });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_KEY: z.string().min(32, "KEY phải có ít nhất 32 ký tự"),
  JWT_REFRESH_KEY: z.string().min(32, "KEY phải có ít nhất 32 ký tự"),
  UPLOAD_TYPE: z.string().default("local"),
  UPLOAD_DIR: z.string().nonempty("Cần cung cấp địa chỉ lưu file"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // logger.error(parsedEnv.error.format());
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
