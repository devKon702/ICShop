import { Request, Response } from "express";
import addressRepository from "../repositories/address.repository";
import { TokenPayload } from "../types/token-payload";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { AddressResponseCode } from "../constants/codes/address.code";

class AddressController {
  public getMyAddress = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const addresses = await addressRepository.findAddressByUserId(sub);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AddressResponseCode.OK,
          "Lấy danh sách địa chỉ thành công",
          addresses
        )
      );
  };
}

export default new AddressController();
