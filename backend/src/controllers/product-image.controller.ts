import { Request, Response } from "express";
import productImageRepository from "../repositories/product-image.repository";
import { TokenPayload } from "../types/token-payload";
import {
  createProductImageSchema,
  deleteProductImageSchema,
  updateProductImageSchema,
} from "../schemas/product-image.schema";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";
import { ProductImageResponseCode } from "../constants/codes/product-image.code";
import { validateFile } from "../utils/file";
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
    } = updateProductImageSchema.parse(req);

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
}

export default new ProductImageController();
