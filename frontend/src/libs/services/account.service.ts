import apiAxios from "@/libs/api/api-axios";
import { AccountBaseSchema } from "@/libs/schemas/account.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
import { axiosHandler } from "@/utils/response-handler";

const accountService = {
  getMe: async () =>
    axiosHandler(
      apiAxios.get("/v1/account/me"),
      ApiResponseSchema(AccountBaseSchema.extend({ user: UserBaseSchema }))
    ),
};

export default accountService;
