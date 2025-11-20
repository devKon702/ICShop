import { Request, Response } from "express";
import { TokenPayload } from "../types/token-payload";
import {
  createAttrValSchema,
  deleteAttrValSchema,
  updateAttrValSchema,
} from "../schemas/attribute-value.schema";
import attributeRepository from "../repositories/attribute.repository";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";
import { AttrValResponseCode } from "../constants/codes/attribute-value.code";
import attributeValueRepository from "../repositories/attribute-value.repository";
import { successResponse } from "../utils/response";
import { AccessTokenPayload } from "../services/jwt.service";

class AttributeValueController {
  public create = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { attributeId, value },
    } = createAttrValSchema.parse(req);

    const attribute = await attributeRepository.findById(attributeId);
    if (!attribute)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AttrValResponseCode.ATTR_NOT_FOUND,
        "Không tìm thấy thông số",
        true
      );
    const attrVal = await attributeValueRepository.create(sub, {
      attributeId,
      value,
    });
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AttrValResponseCode.OK,
          "Tạo giá trị thành công",
          attrVal
        )
      );
  };
  public update = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { value },
      params: { id },
    } = updateAttrValSchema.parse(req);

    const newVal = await attributeValueRepository.update(sub, id, { value });
    if (!newVal)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AttrValResponseCode.NOT_FOUND,
        "Không tìm thấy thông số",
        true
      );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AttrValResponseCode.OK,
          "Cập nhật giá trị thành công",
          newVal
        )
      );
  };
  public delete = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = deleteAttrValSchema.parse(req);
    await attributeValueRepository.delete(id);
    res
      .status(HttpStatus.OK)
      .json(successResponse(AttrValResponseCode.OK, "Xóa giá trị thành công"));
  };
}

export default new AttributeValueController();
