import express from "express";
import locationController from "../controllers/location.controller";
import { findByIdSchema } from "../schemas/shared.schema";
import { validate } from "../middlewares/validate.middleware";

const locationRouter = express.Router();
const path = "/location";

// GET /location/provinces
locationRouter.get(path + "/provinces", locationController.getProvinces);
// GET /location/provinces/:id/districts
locationRouter.get(
  path + "/provinces/:id/districts",
  validate(findByIdSchema),
  locationController.getDistrictsByProvinceId
);
// GET /location/districts/:id/wards
locationRouter.get(
  path + "/districts/:id/wards",
  validate(findByIdSchema),
  locationController.getWardsByDistrictId
);
export default locationRouter;
