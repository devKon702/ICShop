import apiAxios from "@/libs/api/api-axios";
import {
  AttributeBaseSchema,
  CreateAttributeSchema,
  GetAttributeListWithValues,
} from "@/libs/schemas/attribute.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

const attributeService = {
  create: async (categoryId: number, name: string) =>
    axiosHandler(
      apiAxios.post("/v1/attribute", { categoryId, name }),
      ApiResponseSchema(CreateAttributeSchema)
    ),

  update: async (id: number, name: string) =>
    axiosHandler(
      apiAxios.put("/v1/attribute/" + id, { name }),
      ApiResponseSchema(AttributeBaseSchema)
    ),

  delete: async (id: number) =>
    axiosHandler(
      apiAxios.delete("/v1/attribute/" + id),
      ApiResponseSchema(z.null().optional())
    ),

  getByCategoryId: async (categoryId: number) =>
    axiosHandler(
      apiAxios.get("/v1/admin/attribute/category/" + categoryId),
      ApiResponseSchema(GetAttributeListWithValues)
    ),
};

export default attributeService;
