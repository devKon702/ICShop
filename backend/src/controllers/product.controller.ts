import { Request, Response } from "express";
import { ResponseObject, StatusCode } from "../models/response";
import productRepository from "../repositories/product.repository";
import { TypedRequest } from "../types/TypedRequest";
import { HttpStatus } from "../constants/http-status";
import { failResponse, successResponse } from "../utils/response";
import { ProductResponseCode } from "../constants/codes/product.code";
import { TokenPayload } from "../types/token-payload";
import { createProductSchema } from "../schemas/product.shema";
import categoryRepository from "../repositories/category.repository";
import { AppError } from "../errors/app-error";
import { CategoryResponseCode } from "../constants/codes/category.code";
import attributeRepository from "../repositories/attribute.repository";
import { ValidateResponseCode } from "../constants/codes/validate.code";
import { ValidateError } from "../errors/validate-error";
import { validateFile } from "../utils/file";
import { createSlug } from "../utils/slug";
import storage from "../storage";

class ProductController {
  getProductBySlug = async (
    req: TypedRequest<{ slug: string }>,
    res: Response<ResponseObject>
  ) => {
    const { slug } = req.params;
    const product = await productRepository.findBySlug(slug);
    if (!product)
      res.status(404).json(new ResponseObject(404, "Not found", null));
    else {
      res.status(200).json(new ResponseObject(200, "Success", product));
    }
  };

  filter = async (
    req: TypedRequest<
      { categorySlug: string },
      any,
      { name?: string; attrids?: string; page?: string; limit?: string }
    >,
    res: Response
  ) => {
    const { categorySlug } = req.params;
    const { attrids, name, page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const attrIds = attrids
      ? attrids.split(",").map((id) => BigInt(id.trim()))
      : [];
    try {
      const [products, total] = await productRepository.filter(
        categorySlug,
        attrIds,
        name,
        pageNumber,
        limitNumber
      );
      res.status(HttpStatus.OK).json(
        successResponse(ProductResponseCode.OK, "success", products, {
          total,
          page: pageNumber,
          limit: limitNumber,
        })
      );
    } catch (e) {
      console.log(e);
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(new ResponseObject(StatusCode.BAD_REQUEST, "fail", null));
    }
  };

  getProductByCategoryId = async (
    req: TypedRequest<
      { categoryId: string },
      any,
      { page: string; limit: string }
    >,
    res: Response
  ) => {
    const { categoryId } = req.params;
    const { page = "1", limit = "10" } = req.query;
    try {
      const [products, total] = await productRepository.findByCategoryId(
        Number(categoryId),
        Number(page),
        Number(limit)
      );
      res.status(HttpStatus.OK).json(
        successResponse(ProductResponseCode.OK, "success", products, {
          total,
          limit: Number(limit),
          page: Number(page),
        })
      );
    } catch (e) {
      console.log(e);
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(failResponse(ProductResponseCode.FAIL, "fail"));
    }
  };

  // New

  // Check if wholesale detail of product has gap
  private hasGap = (ranges: { min: number; max: number | null }[]) => {
    if (ranges.length === 0) return false;

    // object has max will in the last
    // const sorted = [...ranges].sort((a, b) => {
    //   if (a.max === null) return 1;
    //   if (b.max === null) return -1;
    //   return a.min - b.min;
    // });

    for (let i = 1; i < ranges.length; i++) {
      const prev = ranges[i - 1];
      const curr = ranges[i];

      // If curr.min > prev.max + 1 && prev.max != null => has gap
      if (prev.max !== null && curr.min > prev.max + 1) {
        return true;
      }
    }

    return false;
  };

  public create = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: {
        name,
        categoryId,
        desc,
        vat,
        weight,
        datasheetLink,
        valueIds,
        wholesale,
      },
    } = createProductSchema.parse(req);
    const { poster, gallery } = req.files as {
      poster: Express.Multer.File[];
      gallery: Express.Multer.File[];
    };
    // Check category exist
    const [category, attributes] = await Promise.all([
      categoryRepository.findById(categoryId),
      attributeRepository.getByCategoryId(categoryId),
    ]);
    if (!category)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        ProductResponseCode.CATEGORY_NOT_FOUND,
        "Không tìm thấy danh mục",
        true
      );
    // Check valid attribute value
    const isValidValues = valueIds.every((valueId) =>
      attributes.some((attr) =>
        attr.values.some((attrVal) => attrVal.id === valueId)
      )
    );
    // Category not contain attribute value
    if (!isValidValues)
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ProductResponseCode.INVALID_ATTRIBUTE_VALUE,
        "Danh sách giá trị thông số không thuộc danh mục của sản phẩm",
        true
      );

    // Check poster provided
    if (poster.length == 0)
      throw new ValidateError(ValidateResponseCode.INVALID_FILE, [
        { field: "poster", message: "Phải cung cấp ảnh poster" },
      ]);
    else {
      // Validate file uploads
      validateFile(poster[0], {
        inputField: "poster",
        maxSize: 1024 * 1024,
        type: "image",
      });
      gallery.forEach((item) =>
        validateFile(item, {
          inputField: "gallery",
          maxSize: 1024 * 1024,
          type: "image",
        })
      );
    }

    // Check wholesale
    if (
      this.hasGap(
        wholesale.details.map((detail) => ({
          min: detail.min,
          max: detail.max,
        }))
      )
    ) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ProductResponseCode.HAS_GAP_PRICE,
        "Bảng giá phải theo thứ tự tăng dần và không có khoảng trống",
        true
      );
    }
    // OK
    // Get early fil url
    const posterFileName = String(Date.now());
    const galleryFileNames = gallery.map(
      (_, index) => String(Date.now()) + index
    );
    const posterUrl = storage.getEarlyDir(posterFileName, poster[0].mimetype);
    const galleryUrls = galleryFileNames.map((item, index) =>
      storage.getEarlyDir(item, gallery[index].mimetype)
    );
    const product = await productRepository.create(sub, {
      name,
      slug: createSlug(name),
      categoryId,
      desc,
      vat,
      weight,
      datasheetLink,
      posterUrl,
      imageUrls: galleryUrls,
      valueIds,
      wholesale,
    });
    // Create succesfully -> upload files
    if (product) {
      await Promise.all([
        storage.save(poster[0].buffer, String(Date.now()), poster[0].mimetype),
        ...gallery.map((item, index) =>
          storage.save(
            item.buffer,
            String(Date.now()) + "" + index,
            item.mimetype
          )
        ),
      ]);
    }
  };
}

export default new ProductController();
