import express from "express";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import {
  createAttributeSchema,
  deleteAttributeSchema,
  getAttributeByCategoryId,
  updateAttributeSchema,
} from "../schemas/attribute.schema";
import attributeController from "../controllers/attribute.controller";

const attributeRouter = express.Router();
const path = "/attribute";
const adminPath = "/admin/attribute";

// GET /admin/attribute/category/:id
attributeRouter.get(
  adminPath + "/category/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(getAttributeByCategoryId),
  attributeController.getByCategoryId
);

attributeRouter.post(
  path,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(createAttributeSchema),
  attributeController.create
);

attributeRouter.put(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateAttributeSchema),
  attributeController.update
);

attributeRouter.delete(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(deleteAttributeSchema),
  attributeController.delete
);

export default attributeRouter;
