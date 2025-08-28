import express from "express";
import productController from "../controllers/product.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductSchema,
  filterProductSchema,
  getProductByName,
  getProductByIdSchema,
  getProductBySlugSchema,
  updatePosterSchema,
  updateProductSchema,
  updateProductCategorySchema,
  updateActiveProductSchema,
  updateWholesaleProductSchema,
} from "../schemas/product.shema";
import { upload } from "../utils/multer";

const productRouter = express.Router();
const path = "/product";

// GET /product?cid=&name=&order=&active=&page=&limit=
productRouter.get(
  path,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(filterProductSchema),
  productController.filter
);

// GET /product/slug/:slug
productRouter.get(
  path + "/slug/:slug",
  validate(getProductBySlugSchema),
  productController.getBySlug
);

// GET /product/search?name=&page=&limit=
productRouter.get(
  path + "/search",
  validate(getProductByName),
  productController.getByName
);

// GET /product/:id
productRouter.get(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(getProductByIdSchema),
  productController.getById
);

// POST /product
productRouter.post(
  path,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(createProductSchema),
  productController.create
);

// PATCH /product/poster
productRouter.patch(
  path + "/:id/poster",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  upload.single("poster"),
  validate(updatePosterSchema),
  productController.updatePoster
);

// PATCH /product/:id/info
productRouter.patch(
  path + "/:id/info",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateProductSchema),
  productController.updateInfo
);

// PATCH /product/:id/category
productRouter.patch(
  path + "/:id/category",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateProductCategorySchema),
  productController.updateCategory
);

// PATCH /product/:id/lock
productRouter.patch(
  path + "/:id/lock",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateActiveProductSchema),
  productController.updateActive
);

// PATCH /product/:id/wholesale
productRouter.patch(
  path + "/:id/wholesale",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateWholesaleProductSchema),
  productController.updateWholesale
);
export default productRouter;
