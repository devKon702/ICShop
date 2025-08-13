import { Request, Response } from "express";
import categoryRepository from "../repositories/category.repository";
import { ResponseObject, StatusCode } from "../models/response";
import { TypedRequest } from "../types/TypedRequest";
import { HttpStatus } from "../constants/http-status";

const CategoryController = {
  getCategoryBySlug: async (
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
  },

  getCategoryByName: async (
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
  },

  getCategoryOverview: async (req: Request, res: Response) => {
    try {
      const categories = await categoryRepository.getCategoryOverview();
      res.json(new ResponseObject(200, "success", categories));
    } catch {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(new ResponseObject(StatusCode.BAD_REQUEST, "fail", null));
    }
  },
};

export default CategoryController;
