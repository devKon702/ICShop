import express from "express";
import dotenv from "dotenv";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { APP_PORT } from "./constants/env";

dotenv.config();
const app = express();
app.use(express.json());

// routes
app.use("/api", router);

// error handling
app.use(errorHandler);

app.listen(APP_PORT, () => {
  console.log(`Server running on port ${APP_PORT}`);
});
