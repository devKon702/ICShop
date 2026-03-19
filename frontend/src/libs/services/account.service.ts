import apiAxios from "@/libs/api/api-axios";
import { AccountBaseSchema } from "@/libs/schemas/account.schema";
import {
  ApiResponseSchema,
  PaginatedResponseSchema,
} from "@/libs/schemas/response.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

const path = "/v1/account";
const adminPath = "/v1/admin/account";

const accountService = {
  getMe: async () =>
    axiosHandler(
      apiAxios.get("/v1/account/me"),
      ApiResponseSchema(AccountBaseSchema.extend({ user: UserBaseSchema })),
    ),

  updateEmail: async (data: { email: string; otp: string }) =>
    axiosHandler(
      apiAxios.patch("/v1/account/email", data),
      ApiResponseSchema(z.object({ email: z.string() })),
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
      apiAxios.get(path + `?${query.toString()}`),
      PaginatedResponseSchema(
        AccountBaseSchema.extend({ user: UserBaseSchema }),
      ),
    );
  },

  changeStatus: async (data: { accountId: number; isActive: boolean }) =>
    axiosHandler(
      apiAxios.patch(path + `/status`, data),
      ApiResponseSchema(AccountBaseSchema),
    ),

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) =>
    axiosHandler(
      apiAxios.patch(path + `/password`, data),
      ApiResponseSchema(z.undefined()),
    ),

  adminRequestChangePassword: async (input: {
    password: string;
    newPassword: string;
  }) => {
    return axiosHandler(
      apiAxios.post(adminPath + "/change-password/request", {
        oldPassword: input.password,
        newPassword: input.newPassword,
      }),
      ApiResponseSchema(z.undefined()),
    );
  },

  adminConfirmChangePassword: async (token: string) => {
    return axiosHandler(
      apiAxios.post(adminPath + "/change-password/confirm", { token }),
      ApiResponseSchema(z.undefined()),
    );
  },

  adminRequestChangeEmail: async (password: string) => {
    return axiosHandler(
      apiAxios.post(adminPath + "/change-email/request", { password }),
      ApiResponseSchema(z.undefined()),
    );
  },

  adminSendOtp2ChangeEmail: async (email: string) => {
    return axiosHandler(
      apiAxios.post(adminPath + "/change-email/send-otp", { email }),
      ApiResponseSchema(z.undefined()),
    );
  },

  adminConfirmChangeEmail: async (input: {
    token: string;
    newEmail: string;
    otp: string;
  }) => {
    return axiosHandler(
      apiAxios.post(adminPath + "/change-email/confirm", input),
      ApiResponseSchema(z.undefined()),
    );
  },

  adminRejectChangeEmail: async (token: string) => {
    return axiosHandler(
      apiAxios.post(adminPath + "/change-email/reject", { token }),
      ApiResponseSchema(z.undefined()),
    );
  },

  adminLockAccount: async (token: string) => {
    return axiosHandler(
      apiAxios.post(adminPath + "/lock", { token }),
      ApiResponseSchema(z.undefined()),
    );
  },
};

export default accountService;
