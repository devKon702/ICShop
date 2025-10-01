import apiAxios from "@/libs/api/api-axios";
import { AccountBaseSchema } from "@/libs/schemas/account.schema";
import {
  LoginSchema,
  RefreshSchema,
  SignupSchema,
} from "@/libs/schemas/auth.schema";
import {
  ApiErrorResponseSchema,
  ApiResponseSchema,
} from "@/libs/schemas/response.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

export const authService = {
  testToken: async () =>
    apiAxios
      .get("/v1/auth/testToken")
      .then((response) => response)
      .catch((e) => e),

  refresh: async () =>
    axiosHandler(
      apiAxios.post("/v1/auth/refresh"),
      ApiResponseSchema(RefreshSchema)
    ),

  login: async (email: string, password: string) =>
    axiosHandler(
      apiAxios.post("/v1/auth/login", { email, password }),
      ApiResponseSchema(
        z.object({
          account: AccountBaseSchema.extend({ user: UserBaseSchema }),
          token: z.string(),
        })
      )
    ),

  adminLogin: async (email: string, password: string) =>
    axiosHandler(
      apiAxios.post("/v1/admin/auth/login", { email, password }),
      ApiResponseSchema(LoginSchema)
    ),

  signup: async (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }) =>
    apiAxios
      .post("/v1/auth/signup", data)
      .then((res) => {
        const p = SignupSchema.parse(res.data.data);
        return p;
      })
      .catch((e) => {
        const err = ApiErrorResponseSchema.parse(e.response.data.data);
        return err;
      }),

  logout: async () =>
    axiosHandler(apiAxios.post("/v1/auth/logout"), ApiResponseSchema(z.null())),
};
