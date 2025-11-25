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
  STORAGE_PATH: z.string().nonempty("Cần cung cấp địa chỉ lưu file"),
  REDIS_URL: z.string().url(),
  MAIL_HOST: z.string().nonempty("Cần cung cấp Mail Host"),
  MAIL_PORT: z.string().nonempty("Cần cung cấp Mail Port"),
  MAIL_USER: z.string().nonempty("Cần cung cấp Mail User"),
  MAIL_PASSWORD: z.string().nonempty("Cần cung cấp Mail Password"),
  GOOGLE_CLIENT_ID: z.string().nonempty("Cần cung cấp Google Client ID"),
});

const envVariables =
  process.env.NODE_ENV === "development"
    ? {
        NODE_ENV: "development",
        PORT: "3001",
        DATABASE_URL: "mysql://root:123456@localhost:3306/icdb",
        JWT_ACCESS_KEY: "v5Q2zXt8aYc7Fp9hWjK3Lu0mN4bE6sTr",
        JWT_REFRESH_KEY: "G9k2Qd4nW8yH1vX5aR7pL0mJ3zC6eTfB",
        UPLOAD_TYPE: "local",
        STORAGE_PATH: "D:/icshop/uploads",
        REDIS_URL: "redis://localhost:6379",
        MAIL_HOST: "smtp.gmail.com",
        MAIL_PORT: "587",
        MAIL_USER: "nnk070dev@gmail.com",
        MAIL_PASSWORD: "piesljwdasepcfue",
        GOOGLE_CLIENT_ID:
          "262790314940-17ii1agepmjptr2maadt5p523a20ujti.apps.googleusercontent.com",
      }
    : {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
        JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY,
        UPLOAD_TYPE: process.env.UPLOAD_TYPE,
        STORAGE_PATH: process.env.STORAGE_PATH,
        REDIS_URL: process.env.REDIS_URL,
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
