import apiClient from "@/libs/axios/api-client";
import { AttributeValueBaseSchema } from "@/libs/schemas/attribute-value.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import requestHandler from "@/utils/request-handler";
import { z } from "zod";

const attributeValueService = {
  create: async (attributeId: number, value: string) =>
    requestHandler(
      apiClient.post("/v1/attrval", { attributeId, value }),
      ApiResponseSchema(AttributeValueBaseSchema)
    ),

  delete: async (id: number) =>
    requestHandler(
      apiClient.delete("/v1/attrval/" + id),
      ApiResponseSchema(z.null().optional())
    ),

  update: async (id: number, value: string) =>
    requestHandler(
      apiClient.put("/v1/attrval/" + id, { value }),
      ApiResponseSchema(AttributeValueBaseSchema)
    ),
};

export default attributeValueService;
