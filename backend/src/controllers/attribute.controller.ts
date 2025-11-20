import { Request, Response } from "express";
import { TokenPayload } from "../types/token-payload";
import {
  createAttributeSchema,
  getAttributeByCategoryId,
  updateAttributeSchema,
} from "../schemas/attribute.schema";
import attributeRepository from "../repositories/attribute.repository";
import categoryRepository from "../repositories/category.repository";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";
import { AttributeResponseCode } from "../constants/codes/attribute.code";
import { successResponse } from "../utils/response";
import { deleteAddressSchema } from "../schemas/address.schema";
import { AccessTokenPayload } from "../services/jwt.service";

export class AttributeController {
  public create = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { name, categoryId },
    } = createAttributeSchema.parse(req);

    // Kiểm tra danh mục tồn tại
    const category = await categoryRepository.findById(categoryId);
    if (!category)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AttributeResponseCode.CATEGORY_NOT_FOUND,
        "Không tìm thấy danh mục",
        true
      );
    // Danh mục phải là cấp 3
    if (category.level != 3)
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        AttributeResponseCode.INVALID_CATEGORY,
        "Chỉ thêm cho danh mục cấp 3",
        true
      );
    // Hợp lệ
    const attribute = await attributeRepository.create(sub, {
      name,
      categoryId,
    });
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AttributeResponseCode.OK,
          "Tạo thông số thành công",
          attribute
        )
      );
  };
  public update = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { name },
      params: { id },
    } = updateAttributeSchema.parse(req);
    const newAttribute = await attributeRepository.update(sub, id, { name });
    if (!newAttribute)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AttributeResponseCode.NOT_FOUND,
        "Không tìm thấy thông số",
        true
      );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AttributeResponseCode.OK,
          "Cập nhật thông số thành công",
          newAttribute
        )
      );
  };
  public delete = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = deleteAddressSchema.parse(req);
    await attributeRepository.delete(id);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(AttributeResponseCode.OK, "Xóa thông số thành công")
      );
  };

  public getByCategoryId = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = getAttributeByCategoryId.parse(req);
    const attributes = await attributeRepository.getByCategoryId(id);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AttributeResponseCode.OK,
          "Lấy thông số thành công",
          attributes
        )
      );
  };
}

export default new AttributeController();
