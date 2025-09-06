import express from "express";
import categoryController from "../controllers/category.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import {
  createCategorySchema,
  getCategoryBySlugSchema,
  getProductFromRootCategorySchema,
  udpateCategorySchema,
} from "../schemas/category.schema";
import { upload } from "../utils/multer";
import { deleteAddressSchema } from "../schemas/address.schema";

const categoryRouter = express.Router();
const path = "/category";
const adminPath = "/admin/category";

// GET /category
categoryRouter.get(path, categoryController.getAll4User);

// GET /category/:slug?vids=&page=&limit=&order=
categoryRouter.get(
  path + "/:slug",
  validate(getCategoryBySlugSchema),
  categoryController.getBySlug
);

// GET /category/:id/showroom
categoryRouter.get(
  path + "/:id/showroom",
  validate(getProductFromRootCategorySchema),
  categoryController.getProductFromRootCategory
);

// GET /admin/category
categoryRouter.get(
  adminPath,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  categoryController.getAll4Admin
);

// GET /admin/category/leaf
categoryRouter.get(
  adminPath + "/leaf",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  categoryController.getLeafCategory
);

// GET /admin/category/:id
categoryRouter.get(
  adminPath + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  categoryController.getById
);

categoryRouter.get(
  path + "/overview",
  categoryController.getProductFromRootCategory
);

// POST /admin/category
categoryRouter.post(
  adminPath,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  upload.single("image"),
  validate(createCategorySchema),
  categoryController.create
);

// PUT /admin/category/:id
categoryRouter.put(
  adminPath + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  upload.single("image"),
  validate(udpateCategorySchema),
  categoryController.update
);

// DELETE /admin/category/:id
categoryRouter.delete(
  adminPath + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(deleteAddressSchema),
  categoryController.delete
);

export default categoryRouter;
