import express from "express";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import {
  createAttributeSchema,
  deleteAttributeSchema,
} from "../schemas/attribute.schema";
import attributeController from "../controllers/attribute.controller";
import { updateAddressSchema } from "../schemas/address.schema";

const attributeRouter = express.Router();
const path = "/attribute";

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
  validate(updateAddressSchema),
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
