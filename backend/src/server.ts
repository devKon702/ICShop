import express from "express";
import { env } from "./constants/env";
import router from "./routes";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { requestLogger } from "./middlewares/logger.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import {
  createRateLimiter,
  RateLimitPolicies,
} from "./middlewares/limiter.middleware";
import { startCleanUpSesssion } from "./cron/clean-session";

const app = express();

// Helmet
app.use(helmet());

// Cross-origin
app.use(
  cors({
    origin: [env.APP_BASE_URL, env.ADMIN_BASE_URL],
    credentials: true,
  }),
);

// Body parser
app.use(express.json());

// Cookie
app.use(cookieParser());

// Logger
app.use(requestLogger);

// Rate Limiter
app.use(createRateLimiter(RateLimitPolicies.GLOBAL));

// Static route
app.use(
  "/uploads",
  cors({
    origin: "*",
    credentials: false,
  }),
  express.static(env.STORAGE_PATH),
);

// Routes
app.use("/api", router);

// Error handling
app.use(errorHandler);

// Cron job
startCleanUpSesssion();

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
