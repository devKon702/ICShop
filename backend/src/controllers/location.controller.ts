import { Request, Response } from "express";
import { HttpStatus } from "../constants/http-status";
import locationRepository from "../repositories/location.repository";
import { findByIdSchema } from "../schemas/shared.schema";
import { successResponse } from "../utils/response";
import { LocationResponseCode } from "../constants/codes/location.code";
import { NotFoundError } from "../errors/not-found.error";

class LocationController {
  public getProvinces = async (req: Request, res: Response) => {
    const provinces = await locationRepository.findAllProvinces();
    if (!provinces) {
      throw new NotFoundError(
        LocationResponseCode.NOT_FOUND,
        "Không tìm thấy tỉnh thành"
      );
    }
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          LocationResponseCode.OK,
          "Lấy danh sách tỉnh thành công",
          provinces
        )
      );
  };

  public getDistrictsByProvinceId = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = findByIdSchema.parse(req);
    const districts = await locationRepository.findDistrictsByProvinceId(id);
    if (!districts) {
      throw new NotFoundError(
        LocationResponseCode.NOT_FOUND,
        "Không tìm thấy quận huyện"
      );
    }
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          LocationResponseCode.OK,
          "Lấy danh sách quận huyện thành công",
          districts
        )
      );
  };

  public getWardsByDistrictId = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = findByIdSchema.parse(req);
    const wards = await locationRepository.findWardByDistrictId(id);
    if (!wards) {
      throw new NotFoundError(
        LocationResponseCode.NOT_FOUND,
        "Không tìm thấy xã phường"
      );
    }
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          LocationResponseCode.OK,
          "Lấy danh sách xã phường thành công",
          wards
        )
      );
  };
}

export default new LocationController();
