import apiClient from "@/libs/axios/api-client";
import apiPublic from "@/libs/axios/api-public";
import {
  LoginSchema,
  RefreshSchema,
  SignupSchema,
} from "@/libs/schemas/auth.schema";
import {
  ApiErrorResponseSchema,
  ApiResponseSchema,
} from "@/libs/schemas/response.schema";
import requestHandler from "@/utils/request-handler";

export const authService = {
  testToken: async () =>
    apiClient
      .get("/v1/auth/testToken")
      .then((response) => response)
      .catch((e) => e),

  refresh: async () =>
    requestHandler(
      apiClient.post("/v1/auth/refresh", null, { withCredentials: true }),
      ApiResponseSchema(RefreshSchema)
    ),

  login: async (email: string, password: string) =>
    requestHandler(
      apiPublic.post("/v1/auth/login", { email, password }),
      ApiResponseSchema(LoginSchema)
    ),

  adminLogin: async (email: string, password: string) =>
    requestHandler(
      apiPublic.post("/v1/admin/auth/login", { email, password }),
      ApiResponseSchema(LoginSchema)
    ),

  signup: async (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }) =>
    apiPublic
      .post("/v1/auth/signup", data)
      .then((res) => {
        const p = SignupSchema.parse(res.data.data);
        return p;
      })
      .catch((e) => {
        const err = ApiErrorResponseSchema.parse(e.response.data.data);
        return err;
      }),
};
