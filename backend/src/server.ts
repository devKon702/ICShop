import express from "express";
import router from "./routes";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { PORT } from "./constants/env";
import { requestLogger } from "./middlewares/logger.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());

// Cross-origin
app.use(
  cors({
    origin: "http://localhost:3000",
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
