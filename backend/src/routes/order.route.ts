import express from "express";
import orderController from "../controllers/order.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import {
  cancleOrderSchema,
  createOrderSchema,
  createOrderTimelineSchema,
  filterOrderSchema,
  getMyOrderSchema,
  getOrderByIdSchema,
  seenOrderTimelineSchema,
  updateTimelineDescSchema,
} from "../schemas/order.schema";

const orderRouter = express.Router();
const path = "/order";
const adminPath = "/admin/order";

// GET /order
orderRouter.get(
  path,
  verifyAccessToken,
  authorize([Role.USER]),
  validate(getMyOrderSchema),
  orderController.getMyOrder
);

// GET /order/filter
orderRouter.get(
  adminPath + "/filter",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(filterOrderSchema),
  orderController.adminFilterOrder
);

// GET /order/timeline
orderRouter.get(
  path + "/timeline",
  verifyAccessToken,
  authorize([Role.USER]),
  orderController.getMyUnseenOrderTimeline
);

// GET /order/:id
orderRouter.get(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.USER]),
  validate(getOrderByIdSchema),
  orderController.getMyOrderById
);

// GET /order/:id/detail
orderRouter.get(
  adminPath + "/:id/detail",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(getOrderByIdSchema),
  orderController.adminGetOrderById
);

// POST /order
orderRouter.post(
  path,
  verifyAccessToken,
  authorize([Role.USER]),
  validate(createOrderSchema),
  orderController.create
);

// POST /order/:id
orderRouter.post(
  path + "/:id/cancel",
  verifyAccessToken,
  authorize([Role.USER]),
  validate(cancleOrderSchema),
  orderController.cancelOrder
);

// POST /order/:id
orderRouter.post(
  adminPath + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(createOrderTimelineSchema),
  orderController.adminChangeOrderStatus
);

// PATCH /order/timeline/:id
orderRouter.patch(
  path + "/timeline/:id",
  verifyAccessToken,
  authorize([Role.USER]),
  validate(seenOrderTimelineSchema),
  orderController.seenOrderTimeline
);

// PATCH /order/timeline/:id/desc
orderRouter.patch(
  adminPath + "/timeline/:id/desc",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateTimelineDescSchema),
  orderController.adminUpdateTimelineDesc
);

export default orderRouter;
