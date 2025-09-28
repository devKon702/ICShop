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

  public getById4Admin = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = getProductByIdSchema.parse(req);
    const product = await productRepository.findById4Admin(id);
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

  public filter4Admin = async (req: Request, res: Response) => {
    const {
      query: { name, cid, page, limit, order, active },
    } = filterProductSchema.parse(req);
    const [products, total] = await productRepository.filter4Admin(
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
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        ProductResponseCode.POSTER_REQUIRED,
        "Không tìm thấy file",
        true
      );
    const product = await productRepository.findById4Check(id);
    if (!product)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        ProductResponseCode.NOT_FOUND,
        "Không tìm thấy sản phẩm",
        true
      );
    // Handle file change
    const result = await handleImagesUpload(
      [poster],
      (newUrls) => productRepository.updatePoster(sub, id, newUrls[0]),
      product.posterUrl ? [product.posterUrl] : [],
      {
        inputField: "poster",
        maxSize: 512 * 1024,
      }
    );

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
      body: { datasheetLink, desc, name, vat, weight },
      params: { id },
    } = updateProductSchema.parse(req);

    // Sannitize desc
    const sanitizedDesc = desc === null ? null : sanitizeHtml(desc);

    // Cập nhật
    const newProduct = await productRepository.updateInfo(sub, id, {
      name,
      datasheetLink,
      desc: sanitizedDesc,
      vat,
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
    const product = await productRepository.findById4Check(id);
    if (!product)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        ProductResponseCode.NOT_FOUND,
        "Không tìm thấy sản phẩm",
        true
      );
    // Check valid category
    const category = await categoryRepository.findById(categoryId);
    // Check exists
    if (!category)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        ProductResponseCode.CATEGORY_NOT_FOUND,
        "Không tìm thấy danh mục",
        true
      );
    // Only add product to category level 3
    if (product.categoryId !== categoryId && category.level !== 3)
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ProductResponseCode.INVALID_CATEGORY,
        "Chỉ có thể chọn danh mục cấp 3",
        true
      );

    const oldValueIds = product.attributes.map((item) => item.attributeValueId);
    // value ids that need to be add link
    const addValueIds = vids.filter((item) => !oldValueIds.includes(item));
    // value ids that need to be delete link
    const deleteValueIds = oldValueIds.filter((item) => !vids.includes(item));
    // Check value is in the correct category
    if (addValueIds.length > 0) {
      const validValue: number[] = [];
      // Get all value id in category
      category.attributes.forEach((attr) =>
        attr.values.forEach((value) => validValue.push(value.id))
      );
      // Check addValueIds is all in the validValue
      if (addValueIds.some((item) => !validValue.includes(item)))
        throw new AppError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          ProductResponseCode.INVALID_ATTRIBUTE_VALUE,
          "Thông số không thuộc danh mục",
          true
        );
    }
    // Update category and add value
    const result = await productRepository.updateCategory(sub, id, {
      categoryId,
      vids: addValueIds,
    });
    // Delete value id
    const deletePs = deleteValueIds.map((item) =>
      attributeValueRepository.delete(item)
    );
    await Promise.all(deletePs);
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
      body: { details, max_quantity, min_quantity, quantity_step, unit },
      params: { id },
    } = updateWholesaleProductSchema.parse(req);
    // Update wholesale
    const wholesale = await wholesaleRepository.updateWholesaleByProductId(
      sub,
      id,
      { min_quantity, max_quantity, quantity_step, unit, details }
    );
    // get new detail id -> for delete old detail
    const excludeIds = wholesale.details.map((item) => item.id);
    // Cặp nhật giá hiển thị mặc định cho sản phẩm
    const updatePricePs = productRepository.updatePrice(
      sub,
      id,
      details[0].price
    );
    // Xóa các detail giá dư thừa
    const deleteOtherDetailPs = wholesaleRepository.deleteAllDetailByProductId(
      id,
      excludeIds
    );
    await Promise.all([updatePricePs, deleteOtherDetailPs]);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          ProductResponseCode.OK,
          "Cập nhật bảng giá thành công",
          wholesale
        )
      );
  };

  public delete = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = findByIdSchema.parse(req);
    const product = await productRepository.delete(id);
    if (!product) {
      throw new NotFoundError(ProductResponseCode.NOT_FOUND);
    }
    res
      .status(HttpStatus.OK)
      .json(successResponse(ProductResponseCode.OK, "Xóa sản phẩm thành công"));
  };
}

export default new ProductController();
