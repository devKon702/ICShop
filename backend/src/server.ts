import express from "express";
import { env } from "./constants/env";
import router from "./routes";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { requestLogger } from "./middlewares/logger.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(express.json());

// Helmet
app.use(helmet());

// Static route
app.use("/uploads", express.static(env.UPLOAD_DIR));

// Cross-origin
app.use(
  cors({
    origin: ["http://localhost:3000", "http://admin.localhost:3000"],
    credentials: true,
  })
);
// Cookie
app.use(cookieParser());

// Log
app.use(requestLogger);

// Routes
app.use("/api", router);

// Error handling
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
