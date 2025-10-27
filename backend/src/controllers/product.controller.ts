import { Request, Response } from "express";
import productRepository from "../repositories/product.repository";
import { TypedRequest } from "../types/TypedRequest";
import { HttpStatus } from "../constants/http-status";
import { failResponse, successResponse } from "../utils/response";
import { ProductResponseCode } from "../constants/codes/product.code";
import { TokenPayload } from "../types/token-payload";
import {
  createProductSchema,
  filterProductSchema,
  getProductByIdSchema,
  getProductByName,
  getProductBySlugSchema,
  updateActiveProductSchema,
  updatePosterSchema,
  updateProductCategorySchema,
  updateProductSchema,
  updateWholesaleProductSchema,
} from "../schemas/product.shema";
import categoryRepository from "../repositories/category.repository";
import { AppError } from "../errors/app-error";
import attributeRepository from "../repositories/attribute.repository";
import { handleImagesUpload, validateFile } from "../utils/file";
import { createSlug } from "../utils/slug";
import storage from "../storage";
import { sanitizeHtml } from "../utils/sanitize";
import attributeValueRepository from "../repositories/attribute-value.repository";
import wholesaleRepository from "../repositories/wholesale.repository";
import { NotFoundError } from "../errors/not-found-error";
import productImageRepository from "../repositories/product-image.repository";
import { findByIdSchema } from "../schemas/shared.schema";
import productAttributeRepository from "../repositories/product-attribute.repository";
import { ValidateError } from "../errors/validate-error";
import { ValidateResponseCode } from "../constants/codes/validate.code";

class ProductController {
  public getBySlug = async (req: Request, res: Response) => {
    const {
      params: { slug },
    } = getProductBySlugSchema.parse(req);
    const product = await productRepository.findBySlug(slug);
    if (!product) throw new NotFoundError(ProductResponseCode.NOT_FOUND);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductResponseCode.OK,
          "Lấy sản phẩm thành công",
          product
        )
      );
  };

  public adminGetById = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = getProductByIdSchema.parse(req);
    const product = await productRepository.adminFindById(id);
    if (!product) new NotFoundError(ProductResponseCode.NOT_FOUND);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductResponseCode.OK,
          "Lấy thông tin sản phẩm thành công",
          product
        )
      );
  };

  public getByName = async (req: Request, res: Response) => {
    const {
      query: { name, page, limit },
    } = getProductByName.parse(req);
    const [products, total] = await productRepository.findByName(
      name,
      page,
      limit
    );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductResponseCode.OK,
          "Tìm kiếm thành công",
          products,
          { page, limit, total }
        )
      );
  };

  public adminFilter = async (req: Request, res: Response) => {
    const {
      query: { name, cid, page, limit, order, active },
    } = filterProductSchema.parse(req);
    const [products, total] = await productRepository.adminFilter(
      cid,
      name,
      page,
      limit,
      order,
      active
    );
    res.status(HttpStatus.OK).json(
      successResponse(ProductResponseCode.OK, "Lọc thành công", products, {
        page,
        limit,
        total,
      })
    );
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

  public create = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: {
        name,
        categoryId,
        desc,
        weight,
        datasheetLink,
        valueIds,
        wholesale,
      },
    } = createProductSchema.parse(req);

    // Find category and attribute in category
    const [category, attributes] = await Promise.all([
      categoryRepository.findById(categoryId),
      attributeRepository.getByCategoryId(categoryId),
    ]);
    // Check category exist
    if (!category)
      throw new NotFoundError(ProductResponseCode.CATEGORY_NOT_FOUND);
    // Check only reference category level 3
    if (category.level !== 3)
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ProductResponseCode.INVALID_CATEGORY,
        "Sản phẩm chỉ có thể thuộc danh mục bậc 3",
        true
      );
    // Check if the value is in the correct category
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

    // OK
    const product = await productRepository.create(sub, {
      name,
      slug: createSlug(name),
      categoryId,
      desc,
      weight,
      price: wholesale.details[0].price,
      datasheetLink,
      valueIds,
      wholesale,
      isActive: false,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductResponseCode.OK,
          "Tạo sản phẩm thành công",
          product
        )
      );
  };

  public updatePoster = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
    } = updatePosterSchema.parse(req);
    const poster = req.file;
    // Check poster provided
    if (!poster)
      throw new ValidateError(ValidateResponseCode.INVALID_FILE, [
        { field: "poster", message: "Không tìm thấy file" },
      ]);
    const product = await productRepository.findById(id);
    if (!product)
      throw new NotFoundError(
        ProductResponseCode.NOT_FOUND,
        "Không tìm thấy sản phẩm"
      );
    // Handle file change
    const result = await handleImagesUpload({
      files: [poster],
      fn: (newUrls) => productRepository.updatePoster(sub, id, newUrls[0]),
      oldUrls: product.posterUrl ? [product.posterUrl] : [],
      options: {
        inputField: "poster",
        maxSize: 512 * 1024,
      },
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductResponseCode.OK,
          "Cập nhật poster thành công",
          result
        )
      );
  };

  public updateInfo = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { datasheetLink, desc, name, weight },
      params: { id },
    } = updateProductSchema.parse(req);

    // Sannitize desc
    const sanitizedDesc = desc === null ? null : sanitizeHtml(desc);

    // Update info
    const newProduct = await productRepository.updateInfo(sub, id, {
      name,
      datasheetLink,
      desc: sanitizedDesc,
      weight,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductResponseCode.OK,
          "Cập nhật sản phẩm thành công",
          newProduct
        )
      );
  };

  public updateCategory = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { vids, categoryId },
      params: { id },
    } = updateProductCategorySchema.parse(req);
    // Get product, category, product attributes
    const [product, category, productAttributes] = await Promise.all([
      productRepository.findById(id),
      categoryRepository.findById(categoryId),
      productAttributeRepository.findByProductId(id),
    ]);
    // Check exists
    if (!product)
      throw new NotFoundError(
        ProductResponseCode.NOT_FOUND,
        "Không tìm thấy sản phẩm"
      );
    if (!category)
      throw new NotFoundError(
        ProductResponseCode.CATEGORY_NOT_FOUND,
        "Không tìm thấy danh mục"
      );

    // Only add product to category level 3
    if (category.level !== 3)
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ProductResponseCode.INVALID_CATEGORY,
        "Chỉ có thể chọn danh mục cấp 3",
        true
      );
    // Update category and add value
    const result = await productRepository.updateCategoryAndAttribute(sub, id, {
      categoryId: categoryId === product.categoryId ? undefined : categoryId,
      vids,
    });
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductResponseCode.OK,
          "Cập nhật danh mục thành công",
          result
        )
      );
  };

  public updateActive = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { isActive },
      params: { id },
    } = updateActiveProductSchema.parse(req);
    const product = await productRepository.updateActive(sub, id, isActive);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductResponseCode.OK,
          `${isActive ? "Mở khóa" : "Khóa"} sản phẩm thành công`,
          product
        )
      );
  };

  public updateWholesale = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { details, max_quantity, min_quantity, quantity_step, unit, vat },
      params: { id },
    } = updateWholesaleProductSchema.parse(req);
    // Update wholesale
    const [product, wholesale] = await Promise.all([
      productRepository.findById(id),
      wholesaleRepository.findByProductId(id, true),
    ]);
    if (!product)
      throw new NotFoundError(
        ProductResponseCode.NOT_FOUND,
        "Không tìm thấy sản phẩm"
      );
    if (!wholesale)
      throw new NotFoundError(
        ProductResponseCode.WHOLESALE_NOT_FOUND,
        "Không tìm thấy bảng giá"
      );

    // Check value changed
    const isWholesaleChanged =
      wholesale.min_quantity !== min_quantity ||
      wholesale.max_quantity !== max_quantity ||
      wholesale.quantity_step !== quantity_step ||
      wholesale.unit !== unit ||
      !wholesale.vat.equals(vat);
    const isDetailsChanged = (() => {
      if (wholesale.details.length !== details.length) return true;
      for (let i = 0; i < details.length; i++) {
        if (
          wholesale.details[i].min !== details[i].min ||
          wholesale.details[i].max !== details[i].max ||
          !wholesale.details[i].price.equals(details[i].price) ||
          wholesale.details[i].desc !== details[i].desc
        ) {
          return true;
        }
      }
      return false;
    })();
    const wholesaleUpdated = await wholesaleRepository.update(
      sub,
      wholesale.id,
      {
        wholesale: isWholesaleChanged
          ? {
              min_quantity,
              max_quantity,
              quantity_step,
              unit,
              vat,
            }
          : undefined,
        details: isDetailsChanged
          ? details.map((item) => ({
              min: item.min,
              max: item.max,
              price: item.price,
              desc: item.desc,
            }))
          : undefined,
      }
    );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductResponseCode.OK,
          "Cập nhật bảng giá thành công",
          wholesaleUpdated
        )
      );
  };

  public delete = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = findByIdSchema.parse(req);
    const images = await productImageRepository.findByProductId(id);
    const product = await productRepository.delete(id);
    if (!product) {
      throw new NotFoundError(ProductResponseCode.NOT_FOUND);
    }
    await Promise.all([
      ...images.map((item) => storage.delete(item.imageUrl)),
      product.posterUrl && storage.delete(product.posterUrl),
    ]);
    await productImageRepository.deleteByProductId(id);
    res
      .status(HttpStatus.OK)
      .json(successResponse(ProductResponseCode.OK, "Xóa sản phẩm thành công"));
  };
}

export default new ProductController();
