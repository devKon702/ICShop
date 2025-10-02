import express from "express";
import addressController from "../controllers/address.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import {
  createAddressSchema,
  deleteAddressSchema,
  updateAddressSchema,
} from "../schemas/address.schema";

const addressRouter = express.Router();
const path = "/address";

// GET /address/me
addressRouter.get(
  path,
  verifyAccessToken,
  authorize([Role.USER]),
  addressController.getMyAddress
);

// POST /address
addressRouter.post(
  path,
  verifyAccessToken,
  authorize([Role.USER]),
  validate(createAddressSchema),
  addressController.createAddress
);

// PATCH /address/:id
addressRouter.put(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.USER]),
  validate(updateAddressSchema),
  addressController.updateAddress
);

// DELETE /address/:id
addressRouter.delete(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.USER]),
  validate(deleteAddressSchema),
  addressController.deleteAddress
);
export default addressRouter;
