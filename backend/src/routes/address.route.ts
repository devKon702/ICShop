import express from "express";
import addressController from "../controllers/address.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";

const addressRouter = express.Router();
const path = "/address";

// GET /address
addressRouter.get(
  path,
  verifyAccessToken,
  authorize([Role.USER]),
  addressController.getMyAddress
);

export default addressRouter;
