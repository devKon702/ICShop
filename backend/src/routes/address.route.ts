import express from "express";
import addressController from "../controllers/address.controller";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import {
  createAddressSchema,
  deleteAddressSchema,
  updateAddressSchema,
} from "../schemas/address.schema";
import { findByIdSchema } from "../schemas/shared.schema";

const addressRouter = express.Router();
const path = "/address";

// GET /address/me
addressRouter.get(
  path,
  jwtMiddleware,
  authorize([Role.USER]),
  addressController.getMyAddress
);

// GET /address/provinces
addressRouter.get(path + "/provinces", addressController.getProvinces);
// GET /address/provinces/:id/districts
addressRouter.get(
  path + "/provinces/:id/districts",
  validate(findByIdSchema),
  addressController.getDistrictsByProvinceCode
);
// GET /address/districts/:id/communes
addressRouter.get(
  path + "/districts/:id/communes",
  validate(findByIdSchema),
  addressController.getWardsByDistrictCode
);

// POST /address
addressRouter.post(
  path,
  jwtMiddleware,
  authorize([Role.USER]),
  validate(createAddressSchema),
  addressController.createAddress
);

// PATCH /address/:id
addressRouter.put(
  path + "/:id",
  jwtMiddleware,
  authorize([Role.USER]),
  validate(updateAddressSchema),
  addressController.updateAddress
);

// DELETE /address/:id
addressRouter.delete(
  path + "/:id",
  jwtMiddleware,
  authorize([Role.USER]),
  validate(deleteAddressSchema),
  addressController.deleteAddress
);
export default addressRouter;
