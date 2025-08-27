import express from "express";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import { upload } from "../utils/multer";
import {
  createProductImageSchema,
  deleteProductImageSchema,
  updateProductImageSchema,
} from "../schemas/product-image.schema";
import productImageController from "../controllers/product-image.controller";

const productImageRouter = express.Router();
const path = "/gallery";

// POST /gallery
productImageRouter.post(
  path,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  upload.single("image"),
  validate(createProductImageSchema)
);

// DELETE /gallery/:id
productImageRouter.delete(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(deleteProductImageSchema),
  productImageController.delete
);

// PATCH /gallery
productImageRouter.patch(
  path,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateProductImageSchema),
  productImageController.updatePosition
);

export default productImageRouter;
