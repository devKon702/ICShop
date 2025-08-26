import express from "express";
import productController from "../controllers/product.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import { createProductSchema } from "../schemas/product.shema";
import { upload } from "../utils/multer";

const productRouter = express.Router();
const path = "/product";

productRouter.post(
  path,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  validate(createProductSchema),
  productController.create
);

export default productRouter;
