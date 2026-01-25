import express from "express";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import paymentController from "../controllers/payment.controller";
import { validate } from "../middlewares/validate.middleware";
import { findByIdSchema } from "../schemas/shared.schema";
import {
  createPaymentConfigSchema,
  createPaymentMethodSchema,
  updatePaymentConfigSchema,
  updatePaymentMethodSchema,
} from "../schemas/payment";
const paymentRouter = express.Router();

const path = "/payments";
const adminPath = "/admin/payments";

// GET /payments
paymentRouter.get(path, paymentController.getPayments);

// GET /admin/payments
paymentRouter.get(
  adminPath,
  jwtMiddleware,
  authorize([Role.ADMIN]),
  paymentController.adminGetAllPayments,
);

// GET /payments/:id
paymentRouter.get(
  path + "/:id",
  validate(findByIdSchema),
  paymentController.getPaymentDetail,
);

// GET /admin/payments/:id
paymentRouter.get(
  adminPath + "/:id",
  validate(findByIdSchema),
  paymentController.adminGetPaymentDetail,
);

// POST /admin/payments
paymentRouter.post(
  adminPath,
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(createPaymentMethodSchema),
  paymentController.createPaymentMethod,
);

// POST /admin/payments/configs
paymentRouter.post(
  adminPath + "/configs",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(createPaymentConfigSchema),
  paymentController.createPaymentConfig,
);

// PUT /admin/payments/:id
paymentRouter.put(
  adminPath + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(updatePaymentMethodSchema),
  paymentController.updatePaymentMethod,
);

// PUT /admin/payments/configs/:id
paymentRouter.put(
  adminPath + "/configs/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(updatePaymentConfigSchema),
  paymentController.updatePaymentConfig,
);

// DELETE /payments/:id
paymentRouter.delete(
  adminPath + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(findByIdSchema),
  paymentController.deletePaymentMethod,
);

// DELETE /payments/configs/:id
paymentRouter.delete(
  adminPath + "/configs/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(findByIdSchema),
  paymentController.deletePaymentConfig,
);

export default paymentRouter;
