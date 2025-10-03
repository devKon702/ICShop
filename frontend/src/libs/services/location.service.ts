import apiAxios from "@/libs/api/api-axios";
import { LocationBaseSchema } from "@/libs/schemas/location.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

export const locationService = {
  getProvinces: async () =>
    axiosHandler(
      apiAxios.get("/v1/location/provinces"),
      ApiResponseSchema(z.array(LocationBaseSchema))
    ),
  getDistricts: async (provinceId: number) =>
    axiosHandler(
      apiAxios.get(`/v1/location/provinces/${provinceId}/districts`),
      ApiResponseSchema(z.array(LocationBaseSchema))
    ),
  getWards: async (districtId: number) =>
    axiosHandler(
      apiAxios.get(`/v1/location/districts/${districtId}/wards`),
      ApiResponseSchema(z.array(LocationBaseSchema))
    ),
};

export default locationService;
