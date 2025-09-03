import apiClient from "@/libs/axios/api-client";
import apiPublic from "@/libs/axios/api-public";

export const authService = {
  testToken: async () =>
    apiClient
      .get("/v1/auth/testToken")
      .then((response) => response)
      .catch((e) => e),

  refresh: async () =>
    apiClient.post("/v1/auth/refresh", null, { withCredentials: true }),

  login: async (email: string, password: string) =>
    apiPublic.post("/v1/auth/login", { email, password }),

  adminLogin: async (email: string, password: string) =>
    apiPublic.post("/v1/admin/auth/login", { email, password }),

  signup: async (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }) => apiPublic.post("/v1/auth/signup", data),
};
