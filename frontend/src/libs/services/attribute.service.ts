import apiClient from "@/libs/axios/api-client";
import {
  AttributeBaseSchema,
  CreateAttributeSchema,
  GetAttributeListWithValues,
} from "@/libs/schemas/attribute.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import requestHandler from "@/utils/request-handler";
import { z } from "zod";

const attributeService = {
  create: async (categoryId: number, name: string) =>
    requestHandler(
      apiClient.post("/v1/attribute", { categoryId, name }),
      ApiResponseSchema(CreateAttributeSchema)
    ),

  update: async (id: number, name: string) =>
    requestHandler(
      apiClient.put("/v1/attribute/" + id, { name }),
      ApiResponseSchema(AttributeBaseSchema)
    ),

  delete: async (id: number) =>
    requestHandler(
      apiClient.delete("/v1/attribute/" + id),
      ApiResponseSchema(z.null().optional())
    ),

  getByCategoryId: async (categoryId: number) =>
    requestHandler(
      apiClient.get("/v1/admin/attribute/category/" + categoryId),
      ApiResponseSchema(GetAttributeListWithValues)
    ),
};

export default attributeService;
