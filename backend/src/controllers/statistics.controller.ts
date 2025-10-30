import { Request, Response } from "express";
import {
  countOrderDailySchema,
  countOrdersByStatusSchema,
  getBestSellingProductsSchema,
} from "../schemas/statistics.schema";
import productRepository from "../repositories/product.repository";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { StatisticsResponseCode } from "../constants/codes/statistics.code";
import orderRepository from "../repositories/order.repository";

class StatisticsController {
  public async getBestSellingProducts(req: Request, res: Response) {
    const {
      query: { from, to, limit, sortBy },
    } = getBestSellingProductsSchema.parse(req);

    const result = await productRepository.findBestSellingProducts(
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
    const dates = Array.from({ length: numberOfDays + 1 }, (_, i) => {
      const date = new Date(from);
      date.setDate(from.getDate() + i);
      return date;
    });
    const result = await Promise.all(
      dates.map(async (date) => {
        const count = await orderRepository.countInDay(date);
        return {
          date: date.toISOString().split("T")[0], // only get yyyy-mm-dd
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
}

export default new StatisticsController();
