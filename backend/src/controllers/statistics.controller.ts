import { Request, Response } from "express";
import { getBestSellingProductsSchema } from "../schemas/statistics.schema";
import productRepository from "../repositories/product.repository";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { StatisticsResponseCode } from "../constants/codes/statistics.code";

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
}

export default new StatisticsController();
