import { Response } from "express";
import { TypedRequest } from "../types/TypedRequest";
import { ResponseObject, StatusCode } from "../models/response";
import cartDetailRepository from "../repositories/cart-detail.repository";

const getCartDetailList = async (
  req: TypedRequest<{ userId: number }, any, { page: string; limit: string }>,
  res: Response
) => {
  const { userId } = req.params;
  const { page, limit } = req.query;

  try {
    const cartDetails = await cartDetailRepository.getCartDetailList(
      Number(userId),
      Number(page),
      Number(limit)
    );
    res.json(new ResponseObject(StatusCode.OK, "success", cartDetails));
  } catch {
    res
      .status(400)
      .json(new ResponseObject(StatusCode.BAD_REQUEST, "fail", null));
  }
};

export default { getCartDetailList };
