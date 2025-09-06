import apiClient from "@/libs/axios/api-client";
import { GetMeSchema } from "@/libs/schemas/account.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import requestHandler from "@/utils/request-handler";

const accountService = {
  getMe: async () =>
    requestHandler(
      apiClient.get("/v1/account/me"),
      ApiResponseSchema(GetMeSchema)
    ),
};

export default accountService;
