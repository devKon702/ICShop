import express from "express";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import {
  createAttrValSchema,
  deleteAttrValSchema,
  updateAttrValSchema,
} from "../schemas/attribute-value.schema";
import { validate } from "../middlewares/validate.middleware";
import attributeValueController from "../controllers/attribute-value.controller";
const attributeValueRouter = express.Router();
const path = "/attrval";

attributeValueRouter.post(
  path,
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(createAttrValSchema),
  attributeValueController.create
);

attributeValueRouter.put(
  path + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(updateAttrValSchema),
  attributeValueController.update
);

attributeValueRouter.delete(
  path + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(deleteAttrValSchema),
  attributeValueController.delete
);

export default attributeValueRouter;
