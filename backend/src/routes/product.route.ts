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
import { findByIdSchema } from "../schemas/shared.schema";

const productRouter = express.Router();
const path = "/product";
const adminPath = "/admin/product";

// GET /product/search?name=&page=&limit=
productRouter.get(
  path + "/search",
  validate(getProductByName),
  productController.getByName
);

// GET /product/:slug
productRouter.get(
  path + "/:slug",
  validate(getProductBySlugSchema),
  productController.getBySlug
);

// GET /admin/product/:id
productRouter.get(
  adminPath + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(getProductByIdSchema),
  productController.adminGetById
);

// GET /admin/product?cid=&name=&active=&page=&limit=&order=
productRouter.get(
  adminPath,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(filterProductSchema),
  productController.adminFilter
);

// POST /admin/product
productRouter.post(
  adminPath,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(createProductSchema),
  productController.create
);

// PATCH /admin/product/:id/poster
productRouter.patch(
  adminPath + "/:id/poster",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  upload.single("poster"),
  validate(updatePosterSchema),
  productController.updatePoster
);

// PATCH /admin/product/:id/info
productRouter.patch(
  adminPath + "/:id/info",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateProductSchema),
  productController.updateInfo
);

// PATCH /admin/product/:id/category
productRouter.patch(
  adminPath + "/:id/category",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateProductCategorySchema),
  productController.updateCategory
);

// PATCH /admin/product/:id/lock
productRouter.patch(
  adminPath + "/:id/lock",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateActiveProductSchema),
  productController.updateActive
);

// PATCH /admin/product/:id/wholesale
productRouter.patch(
  adminPath + "/:id/wholesale",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateWholesaleProductSchema),
  productController.updateWholesale
);

// DELETE /admin/product/:id
productRouter.delete(
  adminPath + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(findByIdSchema),
  productController.delete
);
export default productRouter;
