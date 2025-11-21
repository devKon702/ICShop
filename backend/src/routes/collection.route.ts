import express from "express";
import collectionController from "../controllers/collection.controller";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  addProductsToCollectionSchema,
  createColectionSchema,
  getCollectionsSchema,
  updateCollectionSchema,
  updateProductPositionInCollectionSchema,
} from "../schemas/collection.schema";
import { findByIdSchema } from "../schemas/shared.schema";
const collectionRouter = express.Router();

const path = "/collections";
const adminPath = "/admin/collections";
const adminProductCollectionPath = "/admin/product-collections";

// GET /collections
collectionRouter.get(
  path,
  validate(getCollectionsSchema),
  collectionController.getCollections
);

// GET /admin/collections
collectionRouter.get(
  adminPath,
  jwtMiddleware,
  authorize([Role.ADMIN]),
  collectionController.adminGetCollections
);

// GET /admin/collections/products
collectionRouter.get(
  adminPath + "/products",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  collectionController.adminGetCollectionsWithProducts
);

// POST /admin/collections
collectionRouter.post(
  adminPath,
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(createColectionSchema),
  collectionController.createCollection
);

// POST /admin/collections/:id
collectionRouter.post(
  adminPath + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(addProductsToCollectionSchema),
  collectionController.addProductToCollection
);

// PATCH /admin/collections/:id
collectionRouter.patch(
  adminPath + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(updateCollectionSchema),
  collectionController.updateCollection
);

// PATCH /admin/product-collections/:id
collectionRouter.patch(
  adminProductCollectionPath + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(updateProductPositionInCollectionSchema),
  collectionController.updateProductPositionInCollection
);

// DELETE /admin/collections/:id
collectionRouter.delete(
  adminPath + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(findByIdSchema),
  collectionController.deleteCollection
);

// DELETE /admin/product-collections/:id
collectionRouter.delete(
  adminProductCollectionPath + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(findByIdSchema),
  collectionController.removeProductFromCollection
);
export default collectionRouter;
