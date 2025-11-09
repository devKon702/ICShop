import { Request, Response } from "express";
import { TokenPayload } from "../types/token-payload";
import {
  addProductsToCollectionSchema,
  createColectionSchema,
  getCollectionsSchema,
  updateCollectionSchema,
  updateProductPositionInCollectionSchema,
} from "../schemas/collection.schema";
import collectionRepository from "../repositories/collection.repository";
import { createSlug } from "../utils/slug";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { CollectionResponseCode } from "../constants/codes/collection.code";
import { findByIdSchema } from "../schemas/shared.schema";
import { sanitizeData } from "../utils/sanitize";
import productRepository from "../repositories/product.repository";
import { NotFoundError } from "../errors/not-found-error";

class CollectionController {
  public getCollections = async (req: Request, res: Response) => {
    const {
      query: { limit },
    } = getCollectionsSchema.parse(req);
    const collections = await collectionRepository.findMany({
      isActive: true,
      orderBy: "asc",
      product: {
        isActive: true,
        orderBy: "asc",
        limit,
      },
    });

    res.status(HttpStatus.OK).json(
      successResponse(
        CollectionResponseCode.OK,
        "Lấy danh sách bộ sưu tập thành công",
        sanitizeData(collections, {
          useDefault: true,
          omit: ["isActive"],
        })
      )
    );
  };

  public adminGetCollectionsWithProducts = async (
    req: Request,
    res: Response
  ) => {
    const collections = await collectionRepository.findMany({
      orderBy: "asc",
      product: {
        orderBy: "asc",
      },
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CollectionResponseCode.OK,
          "Lấy danh sách bộ sưu tập thành công",
          collections
        )
      );
  };

  public adminGetCollections = async (req: Request, res: Response) => {
    const collections = await collectionRepository.findMany({
      orderBy: "asc",
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CollectionResponseCode.OK,
          "Lấy danh sách bộ sưu tập thành công",
          collections
        )
      );
  };

  public createCollection = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { name, desc, isActive, position },
    } = createColectionSchema.parse(req);

    const collection = await collectionRepository.create(sub, {
      name,
      desc: desc || "",
      isActive,
      position,
      slug: createSlug(name),
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CollectionResponseCode.OK,
          "Tạo bộ sưu tập thành công",
          collection
        )
      );
  };

  public updateCollection = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
      body: { name, desc, isActive, position },
    } = updateCollectionSchema.parse(req);

    const collection = await collectionRepository.updateById(sub, id, {
      name,
      desc,
      isActive,
      slug: name ? createSlug(name) : undefined,
      position,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CollectionResponseCode.OK,
          "Cập nhật bộ sưu tập thành công",
          collection
        )
      );
  };

  public deleteCollection = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = findByIdSchema.parse(req);

    const deletedCollection = await collectionRepository.deleteById(id);

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CollectionResponseCode.OK,
          "Xóa bộ sưu tập thành công",
          deletedCollection
        )
      );
  };

  public addProductToCollection = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { productId, position },
      params: { id: collectionId },
    } = addProductsToCollectionSchema.parse(req);

    const [product, collection] = await Promise.all([
      productRepository.findById(productId),
      collectionRepository.findById(collectionId),
    ]);

    if (!product) {
      throw new NotFoundError("Sản phẩm không tồn tại");
    }

    if (!collection) {
      throw new NotFoundError("Bộ sưu tập không tồn tại");
    }

    const newProductCollection =
      await collectionRepository.createProductCollection(sub, {
        collectionId,
        productId,
        position,
      });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CollectionResponseCode.OK,
          "Thêm sản phẩm vào bộ sưu tập thành công",
          newProductCollection
        )
      );
  };

  public removeProductFromCollection = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = findByIdSchema.parse(req);
    const deletedProductCollection =
      await collectionRepository.deleteProductCollectionById(id);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CollectionResponseCode.OK,
          "Xóa sản phẩm khỏi bộ sưu tập thành công",
          deletedProductCollection
        )
      );
  };

  public updateProductPositionInCollection = async (
    req: Request,
    res: Response
  ) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
      body: { position },
    } = updateProductPositionInCollectionSchema.parse(req);

    const productCollection =
      await collectionRepository.findProductCollectionById(id);

    if (!productCollection) {
      throw new NotFoundError("Sản phẩm trong bộ sưu tập không tồn tại");
    }

    const result = await collectionRepository.updateProductCollectionById(
      sub,
      id,
      {
        position,
      }
    );

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CollectionResponseCode.OK,
          "Cập nhật vị trí sản phẩm trong bộ sưu tập thành công",
          result
        )
      );
  };
}

export default new CollectionController();
