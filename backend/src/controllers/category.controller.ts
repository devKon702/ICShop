import { Request, Response } from "express";
import categoryRepository from "../repositories/category.repository";
import { ResponseObject, StatusCode } from "../models/response";
import { TypedRequest } from "../types/TypedRequest";
import { HttpStatus } from "../constants/http-status";
import { TokenPayload } from "../types/token-payload";
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategoryByIdSchema,
  getCategoryBySlugSchema,
  getProductFromRootCategorySchema,
  udpateCategorySchema,
} from "../schemas/category.schema";
import { AppError } from "../errors/app-error";
import { CategoryResponseCode } from "../constants/codes/category.code";
import { createSlug } from "../utils/slug";
import { validateFile } from "../utils/file";
import storage from "../storage";
import { successResponse } from "../utils/response";
import { AddressResponseCode } from "../constants/codes/address.code";
import { logger } from "../utils/logger";
import { NotFoundError } from "../errors/not-found-error";

class CategoryController {
  public getBySlug = async (req: Request, res: Response) => {
    const {
      params: { slug },
      query: { vids, limit, page, order },
    } = getCategoryBySlugSchema.parse(req);
    const category = await categoryRepository.findBySlug(slug, {
      vids,
      limit,
      page,
      order,
    });
    if (!category)
      throw new NotFoundError(
        CategoryResponseCode.NOT_FOUND,
        "Không tìm thấy danh mục"
      );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CategoryResponseCode.OK,
          "Lấy danh mục thành công",
          category
        )
      );
  };

  public getById = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = getCategoryByIdSchema.parse(req);
    const category = await categoryRepository.findById(id);
    if (!category)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        CategoryResponseCode.NOT_FOUND,
        "Không tìm thấy danh mục",
        true
      );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CategoryResponseCode.OK,
          "Lấy danh mục thành công",
          category
        )
      );
  };

  public getAll4User = async (req: Request, res: Response) => {
    const categoryTree = await categoryRepository.getCategoryTree4User();
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CategoryResponseCode.OK,
          "Lấy cây danh mục thành công",
          categoryTree
        )
      );
  };

  public getAll4Admin = async (req: Request, res: Response) => {
    const categoryTree = await categoryRepository.getCategoryTree4Admin();
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CategoryResponseCode.OK,
          "Lấy cây danh mục thành công",
          categoryTree
        )
      );
  };

  public getLeafCategory = async (req: Request, res: Response) => {
    const categories = await categoryRepository.getLeafCategory();
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CategoryResponseCode.OK,
          "Lấy danh mục cấp 3 thành công",
          categories
        )
      );
  };

  getCategoryByName = async (
    req: TypedRequest<any, any, { name: string; limit: number }>,
    res: Response
  ) => {
    const { name, limit } = req.query;
    try {
      const categories = await categoryRepository.findByName(
        name,
        Number(limit)
      );
      res.json(new ResponseObject(StatusCode.OK, "success", categories));
    } catch (e) {
      res
        .status(400)
        .json(new ResponseObject(StatusCode.BAD_REQUEST, "fail", null));
    }
  };

  public getProductFromRootCategory = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = getProductFromRootCategorySchema.parse(req);
    const result = await categoryRepository.getProductFromRoot(id, 5);
    if (!result) throw new NotFoundError(CategoryResponseCode.NOT_FOUND);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CategoryResponseCode.OK,
          "Lấy danh sách sản phẩm thành công",
          result
        )
      );
  };

  public create = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { name, parentId },
    } = createCategorySchema.parse(req);

    // Kiểm tra parent
    let level = 1;
    if (parentId) {
      const parent = await categoryRepository.findById(parentId);
      // Kiểm tra parent có tồn tại
      if (!parent)
        throw new AppError(
          HttpStatus.NOT_FOUND,
          CategoryResponseCode.PARENT_NOT_FOUND,
          "Không tìm thấy danh mục cha",
          true
        );

      // Kiểm tra parent là cấp nhỏ nhất - level == 3
      if (parent.level === 3)
        throw new AppError(
          HttpStatus.CONFLICT,
          CategoryResponseCode.INVALID_PARENT,
          "Không thể thuộc danh mục con nhỏ nhất",
          true
        );
      level = parent.level + 1;
    }

    // Kiểm tra file
    const file = req.file;
    let imageUrl;
    if (file) {
      validateFile(file, {
        inputField: "body.image",
        maxSize: 1024 * 1024,
        type: "image",
      });
      imageUrl = await storage.save(
        file.buffer,
        String(Date.now()),
        file.mimetype
      );
    }

    // Tạo slug
    const slug = createSlug(name);
    // Hợp lệ
    const category = await categoryRepository.create(sub, {
      name,
      slug,
      parentId,
      level,
      imageUrl,
    });
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AddressResponseCode.OK,
          "Tạo danh mục thành công",
          category
        )
      );
  };
  public update = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
      body: { name, parentId },
    } = udpateCategorySchema.parse(req);
    const file = req.file;

    // Kiểm tra tồn tại
    const oldCategory = await categoryRepository.findById(id);
    if (!oldCategory)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        CategoryResponseCode.NOT_FOUND,
        "Không tìm thấy danh mục",
        true
      );
    let newLevel = oldCategory.level;
    // Nếu có truyền parentId khác với parentId cũ
    if (parentId !== undefined && parentId !== oldCategory.parentId) {
      const newParent = await categoryRepository.findById(parentId);
      // Kiểm tra parent tồn tại
      if (!newParent)
        throw new AppError(
          HttpStatus.NOT_FOUND,
          CategoryResponseCode.PARENT_NOT_FOUND,
          "Không tìm thấy thư mục cha",
          true
        );
      // Parent là danh mục con nhỏ nhất
      if (newParent.level === 3)
        throw new AppError(
          HttpStatus.NOT_FOUND,
          CategoryResponseCode.INVALID_PARENT,
          "Không thể thuộc danh mục con nhỏ nhất",
          true
        );
      // Không cho phép chuyển từ bậc 3 -> 1,2
      newLevel = newParent.level + 1;
      if (oldCategory.level === 3 && newLevel !== 3)
        throw new AppError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          CategoryResponseCode.INVALID_LEVEL_EXCHANGE,
          "Không thể nâng bậc danh mục bậc 3",
          true
        );
    }
    // Kiểm tra image
    let imageUrl = oldCategory.imageUrl;
    let fileName = String(Date.now());
    if (file) {
      validateFile(file, {
        inputField: "body.image",
        maxSize: 1024 * 1024,
        type: "image",
      });
      // Lấy link trước nhưng chua lưu
      imageUrl = storage.getEarlyDir(fileName, file.mimetype);
    }

    const newCategory = await categoryRepository.update(sub, id, {
      name,
      imageUrl,
      level: newLevel,
      parentId: parentId ?? null,
      slug: createSlug(name),
    });

    if (file) {
      // Lưu ảnh mới
      await storage.save(file.buffer, fileName, file.mimetype);
      // Xóa ảnh cũ
      await storage.delete(oldCategory.imageUrl!);
    }
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CategoryResponseCode.OK,
          "Cập nhật danh mục thành công",
          newCategory
        )
      );
  };
  public delete = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
    } = deleteCategorySchema.parse(req);

    const deleted = await categoryRepository.delete(id);
    if (deleted && deleted.imageUrl) {
      await storage.delete(deleted.imageUrl);
    }
    logger.info(
      `[${res.locals.requestId}] Admin ${sub} deleted category: ${deleted.name}`
    );
    res
      .status(HttpStatus.OK)
      .json(successResponse(CategoryResponseCode.OK, "Xóa thành công"));
  };
}

export default new CategoryController();
