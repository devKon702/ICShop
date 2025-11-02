import { Request, Response } from "express";
import {
  countOrderDailySchema,
  countOrdersByStatusSchema,
  countUsersSchema,
  getBestSellingProductsSchema,
  getTopUsersByOrderCountSchema,
} from "../schemas/statistics.schema";
import productRepository from "../repositories/product.repository";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { StatisticsResponseCode } from "../constants/codes/statistics.code";
import orderRepository from "../repositories/order.repository";
import userRepository from "../repositories/user.repository";
import { sanitizeData } from "../utils/sanitize";

class StatisticsController {
  public async getBestSellingProducts(req: Request, res: Response) {
    const {
      query: { from, to, limit, sortBy },
    } = getBestSellingProductsSchema.parse(req);

    const result = await orderRepository.findBestSellingProducts(
      from,
      to,
      limit
    );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          StatisticsResponseCode.OK,
          "Lấy sản phẩm bán chạy thành công",
          result
        )
      );
  }

  public async countOrdersByStatus(req: Request, res: Response) {
    const {
      query: { from, to },
    } = countOrdersByStatusSchema.parse(req);
    const result = await orderRepository.countByStatus(from, to);
    res.status(HttpStatus.OK).json(
      successResponse(
        StatisticsResponseCode.OK,
        "Lấy thống kê đơn hàng theo trạng thái thành công",
        result.map((item) => ({
          status: item.status,
          count: item._count.id,
        }))
      )
    );
  }

  public async countOrderDaily(req: Request, res: Response) {
    const {
      query: { from, to },
    } = countOrderDailySchema.parse(req);

    const numberOfDays = Math.ceil(
      (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
    );
    const dates = Array.from({ length: numberOfDays }, (_, i) => {
      const dateFrom = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
      const dateTo = new Date(
        Math.min(
          new Date(from.getTime() + (i + 1) * 24 * 60 * 60 * 1000).getTime() -
            1,
          to.getTime()
        )
      );

      return { dateFrom, dateTo };
    });
    const result = await Promise.all(
      dates.map(async (date) => {
        const count = await orderRepository.countByCreated(
          date.dateFrom,
          date.dateTo
        );
        return {
          from: date.dateFrom,
          to: date.dateTo,
          count,
        };
      })
    );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          StatisticsResponseCode.OK,
          "Lấy thống kê đơn hàng theo ngày thành công",
          result
        )
      );
  }

  public async getTopUsersByOrderCount(req: Request, res: Response) {
    const {
      query: { from, to, limit, sortBy },
    } = getTopUsersByOrderCountSchema.parse(req);

    const group = await orderRepository.findTopUsersByOrderCount({
      from,
      to,
      limit,
      orderBy: sortBy,
    });

    const result = await Promise.all(
      group.map(async (item) => {
        return userRepository
          .findById(item.userId)
          .then((user) => ({ user, orderCount: item._count.id }));
      })
    );

    res.status(HttpStatus.OK).json(
      successResponse(
        StatisticsResponseCode.OK,
        "Lấy thống kê người dùng theo số lượng đơn hàng thành công",
        sanitizeData(result, {
          removeFields: ["password"],
          useDefault: false,
        })
      )
    );
  }

  public async countUsers(req: Request, res: Response) {
    const {
      query: { from, to, active },
    } = countUsersSchema.parse(req);
    const count = await userRepository.countUser({
      from,
      to,
      isActive: active,
    });
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          StatisticsResponseCode.OK,
          "Lấy tổng số người dùng thành công",
          { count }
        )
      );
  }
}
export default new StatisticsController();
