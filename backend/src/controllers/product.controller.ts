import { Request, Response } from "express";
import { ResponseObject, StatusCode } from "../models/response";
import productRepository from "../repositories/product.repository";
import { TypedRequest } from "../types/TypedRequest";
import { HttpStatus } from "../constants/http-status";
import { failResponse, successResponse } from "../utils/response";
import { ProductResponseCode } from "../constants/codes/product.code";

const getProductBySlug = async (
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

const filter = async (
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

const getProductByCategoryId = async (
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

const createProduct = async (req: Request, res: Response) => {};

export default {
  getProductBySlug,
  createProduct,
  filter,
  getProductByCategoryId,
};
