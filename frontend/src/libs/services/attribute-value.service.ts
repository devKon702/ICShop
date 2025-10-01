import apiAxios from "@/libs/api/api-axios";
import { AttributeValueBaseSchema } from "@/libs/schemas/attribute-value.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

const attributeValueService = {
  create: async (attributeId: number, value: string) =>
    axiosHandler(
      apiAxios.post("/v1/attrval", { attributeId, value }),
      ApiResponseSchema(AttributeValueBaseSchema)
    ),

  delete: async (id: number) =>
    axiosHandler(
      apiAxios.delete("/v1/attrval/" + id),
      ApiResponseSchema(z.null().optional())
    ),

  update: async (id: number, value: string) =>
    axiosHandler(
      apiAxios.put("/v1/attrval/" + id, { value }),
      ApiResponseSchema(AttributeValueBaseSchema)
    ),
};

export default attributeValueService;
