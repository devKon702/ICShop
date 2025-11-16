import apiAxios from "@/libs/api/api-axios";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
import { axiosHandler } from "@/utils/response-handler";

export const userService = {
  updateProfile: async (data: {
    name?: string;
    phone?: string;
    avatarFile?: File;
  }) => {
    const formData = new FormData();
    if (data.name) {
      formData.append("name", data.name);
    }
    if (data.phone) {
      formData.append("phone", data.phone);
    }
    if (data.avatarFile) {
      formData.append("avatar", data.avatarFile);
    }

    return axiosHandler(
      apiAxios.patch("/v1/user", formData),
      ApiResponseSchema(
        UserBaseSchema.pick({
          id: true,
          name: true,
          phone: true,
          avatarUrl: true,
        })
      )
    );
  },
};
