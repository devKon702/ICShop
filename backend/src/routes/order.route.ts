import express from "express";
import orderController from "../controllers/order.controller";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import {
  cancleOrderSchema,
  createOrderSchema,
  createOrderTimelineSchema,
  adminFilterOrdersSchema,
  filterMyOrdersSchema,
  getOrderByIdSchema,
  seenOrderTimelineSchema,
  updateTimelineDescSchema,
  getOrdersByProductIdSchema,
  adminGetOrderByUserSchema,
  changeOrderAddressSchema,
} from "../schemas/order.schema";
import { findByIdSchema, idStringSchema } from "../schemas/shared.schema";
import { get } from "http";

const orderRouter = express.Router();
const path = "/order";
const adminPath = "/admin/order";

// GET /order
orderRouter.get(
  path,
  jwtMiddleware,
  authorize([Role.USER]),
  validate(filterMyOrdersSchema),
  orderController.filterMyOrders
);

// GET /admin/order
orderRouter.get(
  adminPath,
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(adminFilterOrdersSchema),
  orderController.adminFilterOrder
);

// GET /order/timeline
orderRouter.get(
  path + "/timeline",
  jwtMiddleware,
  authorize([Role.USER]),
  orderController.getMyUnseenOrderTimeline
);

// GET /admin/order/product/:productId
orderRouter.get(
  adminPath + "/product/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(getOrdersByProductIdSchema),
  orderController.adminFindByProductId
);

// GET /admin/order/user/:id
orderRouter.get(
  adminPath + "/user/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(adminGetOrderByUserSchema),
  orderController.adminGetOrderByUser
);

// GET /order/:id
orderRouter.get(
  path + "/:id",
  jwtMiddleware,
  authorize([Role.USER]),
  validate(getOrderByIdSchema),
  orderController.getMyOrderById
);

// GET /admin/order/:id
orderRouter.get(
  adminPath + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(getOrderByIdSchema),
  orderController.adminGetOrderById
);

// POST /order
orderRouter.post(
  path,
  jwtMiddleware,
  authorize([Role.USER]),
  validate(createOrderSchema),
  orderController.create
);

// PATCH /order/:id/cancel
orderRouter.patch(
  path + "/:id/cancel",
  jwtMiddleware,
  authorize([Role.USER]),
  validate(cancleOrderSchema),
  orderController.cancelOrder
);

// PATCH /order/:id/address
orderRouter.patch(
  path + "/:id/address",
  jwtMiddleware,
  authorize([Role.USER]),
  validate(changeOrderAddressSchema),
  orderController.updateOrderAddress
);

// POST /admin/order/timeline
orderRouter.post(
  adminPath + "/timeline",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(createOrderTimelineSchema),
  orderController.adminChangeOrderStatus
);

// PATCH /order/timeline/:id
orderRouter.patch(
  path + "/timeline/:id",
  jwtMiddleware,
  authorize([Role.USER]),
  validate(seenOrderTimelineSchema),
  orderController.seenOrderTimeline
);

// PATCH /order/timeline/:id/desc
orderRouter.patch(
  adminPath + "/timeline/:id/desc",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(updateTimelineDescSchema),
  orderController.adminUpdateTimelineDesc
);

export default orderRouter;
