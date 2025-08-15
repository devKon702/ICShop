import dotenv from "dotenv";

dotenv.config({ path: `.env` });

export const { PORT, DATABASE_URL, JWT_ACCESS_KEY, JWT_REFRESH_KEY } =
  process.env;
