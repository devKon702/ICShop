import express from "express";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import { validate } from "../middlewares/validate.middleware";
import {
  countOrderDailySchema,
  countOrdersByStatusSchema,
  countUsersSchema,
  getBestSellingProductsSchema,
  getTopUsersByOrderCountSchema,
} from "../schemas/statistics.schema";
import statisticsController from "../controllers/statistics.controller";

const statisticsRouter = express.Router();
const path = "/statistics";

statisticsRouter.get(
  path + "/product/best-sellers",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(getBestSellingProductsSchema),
  statisticsController.getBestSellingProducts
);

statisticsRouter.get(
  path + "/order/by-status",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(countOrdersByStatusSchema),
  statisticsController.countOrdersByStatus
);

statisticsRouter.get(
  path + "/order/daily",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(countOrderDailySchema),
  statisticsController.countOrderDaily
);

statisticsRouter.get(
  path + "/order/top-users",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(getTopUsersByOrderCountSchema),
  statisticsController.getTopUsersByOrderCount
);

statisticsRouter.get(
  path + "/user/count",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(countUsersSchema),
  statisticsController.countUsers
);

export default statisticsRouter;
