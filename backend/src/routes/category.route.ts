import express from "express";
import categoryController from "../controllers/category.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import {
  createCategorySchema,
  udpateCategorySchema,
} from "../schemas/category.schema";
import { upload } from "../utils/multer";
import { deleteAddressSchema } from "../schemas/address.schema";

const categoryRouter = express.Router();
const path = "/category";

// GET /category
categoryRouter.get(path, categoryController.getAll);

// GET /category/slug/:slug
categoryRouter.get(path + "/slug/:slug", categoryController.getBySlug);

// GET category/:id
categoryRouter.get(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  categoryController.getById
);
categoryRouter.get(path + "/overview", categoryController.getCategoryOverview);

// POST /category
categoryRouter.post(
  path,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  upload.single("image"),
  validate(createCategorySchema),
  categoryController.create
);

categoryRouter.put(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  upload.single("image"),
  validate(udpateCategorySchema),
  categoryController.update
);

categoryRouter.delete(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(deleteAddressSchema),
  categoryController.delete
);
export default categoryRouter;
