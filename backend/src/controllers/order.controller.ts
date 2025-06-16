import { Response } from "express";
import { TypedRequest } from "../types/TypedRequest";
import orderRepository from "../repositories/order.repository";
import { ResponseObject, StatusCode } from "../models/response";

const getOrderByUserId = async (
  req: TypedRequest<
    any,
    any,
    { userId: string; page: string; limit: string; orderStatusId?: string }
  >,
  res: Response
) => {
  const { userId, page, limit, orderStatusId } = req.query;
  try {
    let orders = [];
    if (orderStatusId == undefined) {
      console.log(orderStatusId);
      orders = await orderRepository.getOrderByUserId(
        Number(userId),
        Number(page),
        Number(limit)
      );
    } else
      orders = await orderRepository.getOrderByUserIdAndOrderStatusId(
        Number(userId),
        Number(orderStatusId),
        Number(page),
        Number(limit)
      );
    res.json(new ResponseObject(StatusCode.OK, "success", orders));
  } catch {
    res
      .status(400)
      .json(new ResponseObject(StatusCode.BAD_REQUEST, "fail", null));
  }
};

export default { getOrderByUserId };
