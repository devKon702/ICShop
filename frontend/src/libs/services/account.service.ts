import apiAxios from "@/libs/api/api-axios";
import { AccountBaseSchema } from "@/libs/schemas/account.schema";
import {
  ApiResponseSchema,
  PaginatedResponseSchema,
} from "@/libs/schemas/response.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

const accountService = {
  getMe: async () =>
    axiosHandler(
      apiAxios.get("/v1/account/me"),
      ApiResponseSchema(AccountBaseSchema.extend({ user: UserBaseSchema }))
    ),

  updateEmail: async (data: { email: string; otp: string }) =>
    axiosHandler(
      apiAxios.patch("/v1/account/email", data),
      ApiResponseSchema(z.object({ email: z.string() }))
    ),

  filter: async (opts: {
    name?: string;
    email?: string;
    phone?: string;
    page: number;
    limit: number;
    sortBy?: string;
  }) => {
    const query = new URLSearchParams();
    if (opts.name) query.append("name", opts.name);
    if (opts.email) query.append("email", opts.email);
    if (opts.phone) query.append("phone", opts.phone);
    if (opts.page) query.append("page", opts.page.toString());
    if (opts.limit) query.append("limit", opts.limit.toString());
    if (opts.sortBy) query.append("sortBy", opts.sortBy);

    return axiosHandler(
      apiAxios.get(`/v1/account?${query.toString()}`),
      PaginatedResponseSchema(
        AccountBaseSchema.extend({ user: UserBaseSchema })
      )
    );
  },

  changeStatus: async (data: { accountId: number; isActive: boolean }) =>
    axiosHandler(
      apiAxios.patch(`/v1/account/status`, data),
      ApiResponseSchema(AccountBaseSchema)
    ),
};

export default accountService;
