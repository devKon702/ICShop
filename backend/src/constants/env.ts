import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: `.env` });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().default("3000"),
  APP_BASE_URL: z.string().url(),
  APP_NAME: z.string(),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_KEY: z.string().min(32, "KEY phải có ít nhất 32 ký tự"),
  JWT_REFRESH_KEY: z.string().min(32, "KEY phải có ít nhất 32 ký tự"),
  UPLOAD_TYPE: z.string().default("local"),
  STORAGE_PATH: z.string().nonempty("Cần cung cấp địa chỉ lưu file"),
  REDIS_URL: z.string().url(),
  MAIL_HOST: z.string().nonempty("Cần cung cấp Mail Host"),
  MAIL_PORT: z.string().nonempty("Cần cung cấp Mail Port"),
  MAIL_USER: z.string().nonempty("Cần cung cấp Mail User"),
  MAIL_PASSWORD: z.string().nonempty("Cần cung cấp Mail Password"),
  GOOGLE_CLIENT_ID: z.string().nonempty("Cần cung cấp Google Client ID"),
});

const isDev = process.env.NODE_ENV === "development";
const envVariables = {
  NODE_ENV: isDev ? "development" : process.env.NODE_ENV,
  PORT: isDev ? "3001" : process.env.PORT,
  APP_BASE_URL: isDev ? "http://localhost:3000" : process.env.APP_BASE_URL,
  APP_NAME: process.env.APP_NAME + (isDev ? " (Dev)" : ""),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
  JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY,
  UPLOAD_TYPE: isDev ? "local" : process.env.UPLOAD_TYPE,
  STORAGE_PATH: isDev ? "D:/icshop/uploads" : process.env.STORAGE_PATH,
  REDIS_URL: isDev ? "redis://localhost:6379" : process.env.REDIS_URL,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
};

const parsedEnv = envSchema.safeParse(envVariables);

if (!parsedEnv.success) {
  // logger.error(parsedEnv.error.format());
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
