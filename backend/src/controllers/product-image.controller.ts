import { Request, Response } from "express";
import productImageRepository from "../repositories/product-image.repository";
import { TokenPayload } from "../types/token-payload";
import {
  createProductImageSchema,
  deleteProductImageSchema,
  updateProductImagePositionSchema,
  updateProductImageSchema,
} from "../schemas/product-image.schema";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";
import { ProductImageResponseCode } from "../constants/codes/product-image.code";
import { handleImagesUpload, validateFile } from "../utils/file";
import storage from "../storage";
import { successResponse } from "../utils/response";

class ProductImageController {
  public create = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { productId },
    } = createProductImageSchema.parse(req);
    const file = req.file;
    validateFile(file, {
      inputField: "image",
      maxSize: 1024 * 1024,
      type: "image",
    });
    if (file) {
      const fileName = String(Date.now());
      const earlyUrl = storage.getEarlyDir(fileName, file.mimetype);
      const productImage = await productImageRepository.create(
        sub,
        productId,
        earlyUrl
      );
      await storage.save(file.buffer, fileName, file.mimetype);
      res
        .status(HttpStatus.OK)
        .json(
          successResponse(
            ProductImageResponseCode.OK,
            "Thêm ảnh thành công",
            productImage
          )
        );
    } else {
      throw new Error("");
    }
  };

  public delete = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = deleteProductImageSchema.parse(req);

    const productImage = await productImageRepository.delete(id);
    await storage.delete(productImage.imageUrl);
    res
      .status(HttpStatus.OK)
      .json(successResponse(ProductImageResponseCode.OK, "Xóa ảnh thành công"));
  };
  public updatePosition = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
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
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
    } = updateProductImageSchema.parse(req);
    const file = req.file;

    if (!file)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        ProductImageResponseCode.FILE_NOT_FOUND,
        "Không tìm thấy file",
        true
      );

    const productImage = await productImageRepository.findById(id);
    if (!productImage)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        ProductImageResponseCode.NOT_FOUND,
        "Không tìm thấy",
        true
      );

    const result = await handleImagesUpload(
      [file],
      (newUrls) => productImageRepository.updateImage(sub, id, newUrls[0]),
      [productImage.imageUrl]
    );
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
