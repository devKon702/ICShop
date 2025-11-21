import express from "express";
import cartController from "../controllers/cart.controller";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import {
  createCartSchema,
  deleteMultiCartSchema,
} from "../schemas/cart.schema";

const cartRouter = express.Router();
const path = "/cart";

cartRouter.get(
  path,
  jwtMiddleware,
  authorize([Role.USER]),
  cartController.getMyCart
);
cartRouter.post(
  path,
  jwtMiddleware,
  authorize([Role.USER]),
  validate(createCartSchema),
  cartController.createCart
);
cartRouter.delete(
  path,
  jwtMiddleware,
  authorize([Role.USER]),
  validate(deleteMultiCartSchema),
  cartController.deleteMultiCart
);

export default cartRouter;
