import { Request, Response } from "express";
import productImageRepository from "../repositories/product-image.repository";
import { TokenPayload } from "../types/token-payload";
import {
  createProductImageSchema,
  deleteProductImageSchema,
  updateProductImagePositionSchema,
  updateProductImageSchema,
} from "../schemas/product-image.schema";
import { AppError } from "../errors/app.error";
import { HttpStatus } from "../constants/http-status";
import { ProductImageResponseCode } from "../constants/codes/product-image.code";
import { handleImagesUpload, validateFile } from "../utils/file";
import storage from "../storage";
import { successResponse } from "../utils/response";
import { ValidateError } from "../errors/validate.error";
import { ValidateResponseCode } from "../constants/codes/validate.code";
import { NotFoundError } from "../errors/not-found.error";
import { AccessTokenPayload } from "../services/jwt.service";

class ProductImageController {
  public create = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { productId },
    } = createProductImageSchema.parse(req);
    const file = req.file;
    if (!file)
      throw new ValidateError(ValidateResponseCode.INVALID_FILE, [
        { field: "image", message: "Không tìm thấy file" },
      ]);

    const productImage = await handleImagesUpload({
      files: [file],
      fn: async (urls) =>
        productImageRepository.create(sub, productId, urls[0]),
      oldUrls: [],
      options: { maxSize: 512 * 1024, inputField: "image" },
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductImageResponseCode.OK,
          "Thêm ảnh thành công",
          productImage
        )
      );
  };

  public delete = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = deleteProductImageSchema.parse(req);

    const productImage = await productImageRepository.delete(id);
    await storage.delete(productImage.imageUrl);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductImageResponseCode.OK,
          "Xóa ảnh thành công",
          productImage
        )
      );
  };
  public updatePosition = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { gallery },
    } = updateProductImagePositionSchema.parse(req);

    const newGallery = await productImageRepository.updatePosition(
      sub,
      gallery
    );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductImageResponseCode.OK,
          "Thay đổi vị trí thành công",
          newGallery
        )
      );
  };

  public updateImage = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      params: { id },
    } = updateProductImageSchema.parse(req);
    const file = req.file;

    if (!file)
      throw new ValidateError(ValidateResponseCode.INVALID_FILE, [
        { field: "image", message: "Không tìm thấy file" },
      ]);

    const productImage = await productImageRepository.findById(id);
    if (!productImage)
      throw new NotFoundError(
        ProductImageResponseCode.NOT_FOUND,
        "Không tìm thấy ảnh sản phẩm"
      );

    const result = await handleImagesUpload({
      files: [file],
      fn: (newUrls) => productImageRepository.updateImage(sub, id, newUrls[0]),
      oldUrls: [productImage.imageUrl],
      options: { maxSize: 512 * 1024, inputField: "image" },
    });
    await storage.delete(productImage.imageUrl);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductImageResponseCode.OK,
          "Cập nhật thành công",
          result
        )
      );
  };
}

export default new ProductImageController();
