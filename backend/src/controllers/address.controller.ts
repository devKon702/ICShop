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
import { AppError } from "../errors/app.error";
import { findByIdSchema } from "../schemas/shared.schema";
import locationRepository from "../repositories/location.repository";
import { LocationType } from "../constants/db";
import { AccessTokenPayload } from "../services/jwt.service";

class AddressController {
  public getMyAddress = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
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
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: {
        receiverName,
        receiverPhone,
        alias,
        provinceId: provinceCode,
        districtId: districtCode,
        wardId: communeCode,
        detail,
      },
    } = createAddressSchema.parse(req);
    const [province, district, commune] = await Promise.all([
      locationRepository.findLocationById(provinceCode, LocationType.PROVINCE),
      locationRepository.findLocationById(districtCode, LocationType.DISTRICT),
      locationRepository.findLocationById(communeCode, LocationType.WARD),
    ]);
    if (!province || !district || !commune) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AddressResponseCode.NOT_FOUND,
        "Không tìm thấy thông tin địa lý",
        true
      );
    }

    const address = await addressRepository.create({
      userId: sub,
      receiverName,
      receiverPhone,
      alias,
      provinceId: province.id,
      districtId: district.id,
      wardId: commune.id,
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
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      params: { id },
      body: {
        receiverName,
        receiverPhone,
        alias,
        provinceId,
        districtId,
        wardId,
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
    // Kiểm tra thông tin địa lý
    const [province, district, ward] = await Promise.all([
      locationRepository.findLocationById(provinceId, LocationType.PROVINCE),
      locationRepository.findLocationById(districtId, LocationType.DISTRICT),
      locationRepository.findLocationById(wardId, LocationType.WARD),
    ]);
    if (!province || !district || !ward) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AddressResponseCode.NOT_FOUND,
        "Không tìm thấy thông tin địa lý",
        true
      );
    }
    // Hợp lệ

    const newAddress = await addressRepository.update(id, {
      receiverName,
      receiverPhone,
      alias,
      provinceId: province.id,
      districtId: district.id,
      wardId: ward.id,
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
    const { sub } = res.locals.auth as AccessTokenPayload;
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

  public getProvinces = async (req: Request, res: Response) => {
    const provinces = await locationRepository.findAllProvinces();
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AddressResponseCode.OK,
          "Lấy danh sách tỉnh thành công",
          provinces
        )
      );
  };

  public getDistrictsByProvinceCode = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = findByIdSchema.parse(req);
    const districts = await locationRepository.findDistrictsByProvinceId(id);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AddressResponseCode.OK,
          "Lấy danh sách quận huyện thành công",
          districts
        )
      );
  };

  public getWardsByDistrictCode = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = findByIdSchema.parse(req);
    const wards = await locationRepository.findWardByDistrictId(id);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AddressResponseCode.OK,
          "Lấy danh sách xã phường thành công",
          wards
        )
      );
  };
}

export default new AddressController();
