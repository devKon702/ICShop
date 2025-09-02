import { z } from "zod";

export const ENV_ROLE = process.env.NEXT_PUBLIC_ROLE;
export const ENV_API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;
export const ENV_ZALO_LINK = process.env.NEXT_PUBLIC_ZALO_LINK;

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  NEXT_PUBLIC_API_URL: z.string().url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
