import express from "express";
import collectionController from "../controllers/collection.controller";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
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
const adminProductCollectionPath = "/admin/product-collection";

// GET /collections
collectionRouter.get(
  path,
  validate(getCollectionsSchema),
  collectionController.getCollections
);

// GET /admin/collections
collectionRouter.get(
  adminPath,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  collectionController.adminGetCollections
);

// GET /admin/collections/simple
collectionRouter.get(
  adminPath + "/simple",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  collectionController.adminGetSimpleCollections
);

// POST /admin/collections
collectionRouter.post(
  adminPath,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(createColectionSchema),
  collectionController.createCollection
);

// POST /admin/collections/:id
collectionRouter.post(
  adminPath + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(addProductsToCollectionSchema),
  collectionController.addProductToCollection
);

// PATCH /admin/collections/:id
collectionRouter.patch(
  adminPath + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateCollectionSchema),
  collectionController.updateCollection
);

// PATCH /admin/product-collection/:id
collectionRouter.patch(
  adminProductCollectionPath + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateProductPositionInCollectionSchema),
  collectionController.updateProductPositionInCollection
);

// DELETE /admin/collections/:id
collectionRouter.delete(
  adminPath + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(findByIdSchema),
  collectionController.deleteCollection
);

// DELETE /admin/product-collection/:id
collectionRouter.delete(
  adminProductCollectionPath + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(findByIdSchema),
  collectionController.removeProductFromCollection
);
export default collectionRouter;
