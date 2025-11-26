// const env = {
//   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
//   NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
//   NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL,
//   NEXT_PUBLIC_FILE_URL: process.env.NEXT_PUBLIC_FILE_URL,
//   NODE_ENV: process.env.NODE_ENV,
//   NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
// };

import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_CLIENT_URL: z.string().url(),
  NEXT_PUBLIC_ADMIN_URL: z.string().url(),
  NEXT_PUBLIC_FILE_URL: z.string().url(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().nonempty(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const isDev = process.env.NODE_ENV === "development";

const rawEnv = {
  NODE_ENV: isDev ? "development" : process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: isDev
    ? "http://localhost:3001/api"
    : process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_CLIENT_URL: isDev
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_CLIENT_URL,
  NEXT_PUBLIC_ADMIN_URL: isDev
    ? "http://admin.localhost:3000"
    : process.env.NEXT_PUBLIC_ADMIN_URL,
  NEXT_PUBLIC_FILE_URL: isDev
    ? "http://localhost:3001/uploads"
    : process.env.NEXT_PUBLIC_FILE_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
};

const parsedEnv = envSchema.safeParse(rawEnv);

if (!parsedEnv.success) {
  // logger.error(parsedEnv.error.format());
  console.error(parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}

export default parsedEnv.data;
