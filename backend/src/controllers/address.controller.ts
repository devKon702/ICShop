import { Request, Response } from "express";
import addressRepository from "../repositories/address.repository";
import { TokenPayload } from "../types/token-payload";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { AddressResponseCode } from "../constants/codes/address.code";
import {
  createAddressSchema,
  deleteAddressSchema,
  updateAddressSchema,
} from "../schemas/address.schema";
import { AppError } from "../errors/app-error";

class AddressController {
  public getMyAddress = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const addresses = await addressRepository.findByUserId(sub);
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
  public createAddress = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: {
        receiverName,
        receiverPhone,
        alias,
        province,
        district,
        commune,
        detail,
      },
    } = createAddressSchema.parse(req);

    const address = await addressRepository.create({
      userId: sub,
      receiverName,
      receiverPhone,
      alias,
      province,
      district,
      commune,
      detail,
    });
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AddressResponseCode.OK,
          "Thêm địa chỉ thành công",
          address
        )
      );
  };
  public updateAddress = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
      body: {
        receiverName,
        receiverPhone,
        alias,
        province,
        district,
        commune,
        detail,
      },
    } = updateAddressSchema.parse(req);
    const address = await addressRepository.findById(id);
    // Kiểm tra tồn tại
    if (!address)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AddressResponseCode.NOT_FOUND,
        "Không tìm thấy địa chỉ",
        true
      );
    // Kiểm tra địa chỉ là của user
    if (address.userId !== sub)
      throw new AppError(
        HttpStatus.FORBIDDEN,
        AddressResponseCode.NOT_ALLOWED,
        "Không có thể cập nhật địa chỉ này",
        true
      );
    // Hợp lệ

    const newAddress = await addressRepository.update(id, {
      receiverName,
      receiverPhone,
      alias,
      province,
      district,
      commune,
      detail,
    });
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AddressResponseCode.OK,
          "Cập nhật địa chỉ thành công",
          newAddress
        )
      );
  };
  public deleteAddress = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
    } = deleteAddressSchema.parse(req);
    const address = await addressRepository.findById(id);
    // Kiểm tra tồn tại
    if (!address)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AddressResponseCode.NOT_FOUND,
        "Không tìm thấy địa chỉ",
        true
      );
    // Kiểm tra địa chỉ là của user
    if (address.userId !== sub)
      throw new AppError(
        HttpStatus.FORBIDDEN,
        AddressResponseCode.NOT_ALLOWED,
        "Không thể xóa địa chỉ này",
        true
      );
    // Hợp lệ
    await addressRepository.delete(id);
    res
      .status(HttpStatus.OK)
      .json(successResponse(AddressResponseCode.OK, "Xóa thành công"));
  };
}

export default new AddressController();
