import express from "express";
import router from "./routes";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { PORT } from "./constants/env";
import { requestLogger } from "./middlewares/logger.middleware";

const app = express();
app.use(express.json());

// Log
app.use(requestLogger);

// routes
app.use("/api", router);

// error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
