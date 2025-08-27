import express from "express";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import { upload } from "../utils/multer";

const productImageRouter = express.Router();
const path = "/gallery";

productImageRouter.post(
  path,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  upload.single("image")
);
