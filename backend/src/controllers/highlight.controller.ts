import { Request, Response } from "express";
import { TokenPayload } from "../types/token-payload";
import {
  createHighlightSchema,
  deleteHighlightSchema,
  updateHighlightPositionSchema,
} from "../schemas/highlight.schema";
import highlightRepository from "../repositories/highlight.repository";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { HighlightResponseCode } from "../constants/codes/highlight.code";
import { HighlightType } from "../constants/db";
import { sanitizeData } from "../utils/sanitize";

class HighlightController {
  public create = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { productId, highlightType },
    } = createHighlightSchema.parse(req);

    const highlight = await highlightRepository.create(sub, {
      productId,
      type: highlightType,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          HighlightResponseCode.OK,
          "Thêm sản phẩm vào mục nổi bật thành công",
          highlight
        )
      );
  };
  public delete = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = deleteHighlightSchema.parse(req);
    const deleted = await highlightRepository.delete(id);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          HighlightResponseCode.OK,
          "Xóa sản phẩm khỏi mục nổi bật thành công",
          deleted
        )
      );
  };

  public updatePosition = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { data },
    } = updateHighlightPositionSchema.parse(req);

    const result = await Promise.all(
      data.map((item) =>
        highlightRepository.updatePosition(sub, item.id, item.position)
      )
    );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          HighlightResponseCode.OK,
          "Thay đổi vị trí hiển thị thành công",
          result
        )
      );
  };
  public getHighlight = async (req: Request, res: Response) => {
    const types = Object.values(HighlightType);
    const result = await Promise.all(
      types.map((item) => highlightRepository.getHighlight(item, true))
    );

    const list = types.map((item, index) => ({
      type: item,
      list: sanitizeData(result[index], {
        useDefault: true,
        omit: ["isActive", "desc"],
      }),
    }));

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          HighlightResponseCode.OK,
          "Lấy danh sách nổi bật thành công",
          list
        )
      );
  };
  public adminGetHighlight = async (req: Request, res: Response) => {
    const types = Object.values(HighlightType);
    const result = await Promise.all(
      types.map((item) => highlightRepository.getHighlight(item))
    );

    const list = types.map((item, index) => ({
      type: item,
      list: result[index],
    }));

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          HighlightResponseCode.OK,
          "Lấy danh sách nổi bật thành công",
          list
        )
      );
  };
}

export default new HighlightController();
