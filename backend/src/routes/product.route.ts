import express from "express";
import productController from "../controllers/product.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductSchema,
  filterProductSchema,
  getProductByIdSchema,
  getProductBySlugSchema,
} from "../schemas/product.shema";
import { upload } from "../utils/multer";

const productRouter = express.Router();
const path = "/product";

// GET /product/admin?
productRouter.get(
  path + "/admin",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(filterProductSchema)
);

// GET /product?name=&c=&attrid=&order=
productRouter.get(path, validate(filterProductSchema));

// GET /product/:id
productRouter.get(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(getProductByIdSchema),
  productController.findById
);

// GET /product/slug/:slug
productRouter.get(
  path + "/slug/:slug",
  validate(getProductBySlugSchema),
  productController.getBySlug
);

productRouter.post(
  path,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(createProductSchema),
  productController.create
);

productRouter.patch(
  path + "/upload",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ])
);

export default productRouter;
