import apiAxios from "@/libs/api/api-axios";
import { AddressBaseSchema } from "@/libs/schemas/address.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

const addressService = {
  getMyAddresses: async () =>
    axiosHandler(
      apiAxios.get("/v1/address"),
      ApiResponseSchema(z.array(AddressBaseSchema))
    ),
  create: async (data: {
    alias: string;
    receiverPhone: string;
    receiverName: string;
    detail: string;
    communeCode: number;
    districtCode: number;
    provinceCode: number;
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
      communeCode: number;
      districtCode: number;
      provinceCode: number;
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

  getProvinceList: async () =>
    axiosHandler(
      apiAxios.get("/v1/address/provinces"),
      ApiResponseSchema(
        z.array(
          z.object({
            code: z.number(),
            name: z.string(),
          })
        )
      )
    ),
  getDistrictList: async (provinceCode: number) =>
    axiosHandler(
      apiAxios.get(`/v1/address/provinces/${provinceCode}/districts`),
      ApiResponseSchema(
        z.array(
          z.object({
            code: z.number(),
            name: z.string(),
          })
        )
      )
    ),
  getCommuneList: async (districtCode: number) =>
    axiosHandler(
      apiAxios.get(`/v1/address/districts/${districtCode}/communes`),
      ApiResponseSchema(
        z.array(
          z.object({
            code: z.number(),
            name: z.string(),
          })
        )
      )
    ),
};

export default addressService;
