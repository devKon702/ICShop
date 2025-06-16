import { Request, Response } from "express";
import categoryRepository from "../repositories/category.repository";
import { ResponseObject, StatusCode } from "../models/response";
import { TypedRequest } from "../types/TypedRequest";

export const getCategoryBySlug = async (
  req: TypedRequest<{ slug: string }>,
  res: Response
) => {
  const { slug } = req.params;
  try {
    const category = await categoryRepository.findBySlug(slug);
    if (!category)
      res.json(new ResponseObject(StatusCode.NOT_FOUND, "Not Found", null));
    else res.json(new ResponseObject(StatusCode.OK, "success", category));
  } catch (e) {
    res
      .status(400)
      .json(new ResponseObject(StatusCode.BAD_REQUEST, "fail", null));
  }
};

export const getCategoryByName = async (
  req: TypedRequest<any, any, { name: string; limit: number }>,
  res: Response
) => {
  const { name, limit } = req.query;
  try {
    const categories = await categoryRepository.findByName(name, Number(limit));
    res.json(new ResponseObject(StatusCode.OK, "success", categories));
  } catch (e) {
    res
      .status(400)
      .json(new ResponseObject(StatusCode.BAD_REQUEST, "fail", null));
  }
};

export const getCategoryOverview = async (req: Request, res: Response) => {
  try {
    const categories = await categoryRepository.getCategoryOverview();
    res.json(new ResponseObject(200, "success", categories));
  } catch {
    res
      .status(400)
      .json(new ResponseObject(StatusCode.BAD_REQUEST, "fail", null));
  }
};

export default { getCategoryBySlug, getCategoryByName, getCategoryOverview };
