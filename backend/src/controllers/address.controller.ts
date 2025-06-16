import { Response } from "express";
import addressRepository from "../repositories/address.repository";
import { TypedRequest } from "../types/TypedRequest";
import { ResponseObject, StatusCode } from "../models/response";

const getAddressByUserId = async (
  req: TypedRequest<{ userId: string }>,
  res: Response
) => {
  const { userId } = req.params;
  try {
    const addresses = await addressRepository.findAddressByUserId(
      Number(userId)
    );
    res.json(new ResponseObject(StatusCode.OK, "success", addresses));
  } catch {
    res
      .status(400)
      .json(new ResponseObject(StatusCode.BAD_REQUEST, "fail", null));
  }
};

export default { getAddressByUserId };
