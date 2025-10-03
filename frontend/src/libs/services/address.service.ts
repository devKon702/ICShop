import apiAxios from "@/libs/api/api-axios";
import { AddressBaseSchema } from "@/libs/schemas/address.schema";
import { LocationBaseSchema } from "@/libs/schemas/location.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

const addressService = {
  getMyAddresses: async () =>
    axiosHandler(
      apiAxios.get("/v1/address"),
      ApiResponseSchema(
        z.array(
          AddressBaseSchema.extend({
            province: LocationBaseSchema,
            district: LocationBaseSchema,
            ward: LocationBaseSchema,
          })
        )
      )
    ),
  create: async (data: {
    alias: string;
    receiverPhone: string;
    receiverName: string;
    detail: string;
    wardId: number;
    districtId: number;
    provinceId: number;
  }) =>
    axiosHandler(
      apiAxios.post("/v1/address", data),
      ApiResponseSchema(AddressBaseSchema)
    ),
  update: async (
    id: number,
    data: {
      alias: string;
      receiverPhone: string;
      receiverName: string;
      detail: string;
      wardId: number;
      districtId: number;
      provinceId: number;
    }
  ) =>
    axiosHandler(
      apiAxios.post("/v1/address", data),
      ApiResponseSchema(AddressBaseSchema)
    ),
  delete: async (id: number) =>
    axiosHandler(
      apiAxios.delete(`/v1/address/${id}`),
      ApiResponseSchema(z.undefined())
    ),
};

export default addressService;
