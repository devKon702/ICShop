import apiClient from "@/libs/axios/api-client";
import {
  AdminCategoryTreeSchema,
  CategoryBaseSchema,
  CreateCategorySchema,
} from "@/libs/schemas/category.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import requestHandler from "@/utils/request-handler";
import { z } from "zod";

const categoryService = {
  create: async (name: string, parentId?: number) =>
    requestHandler(
      apiClient.post("/v1/admin/category", { name, parentId }),
      ApiResponseSchema(CreateCategorySchema)
    ),

  delete: async (id: number) =>
    requestHandler(
      apiClient.delete("/v1/admin/category/" + id),
      ApiResponseSchema(z.null().optional())
    ),

  getAllCategory4Admin: async () =>
    requestHandler(
      apiClient.get("/v1/admin/category"),
      ApiResponseSchema(AdminCategoryTreeSchema)
    ),

  getLeafCagory: async () =>
    requestHandler(
      apiClient.get("/v1/admin/category/leaf"),
      ApiResponseSchema(z.array(CategoryBaseSchema))
    ),
};

export default categoryService;

// const getCategoryOverview = async () => {
//   try {
//     const res = await fetch(API_ROUTE.category + "/overview").then((res) =>
//       res.json()
//     );
//     return res.data as Category[];
//   } catch (e) {
//     console.log(e);
//   }
// };

// const getCategoryBySlug = async (slug: string) => {
//   try {
//     const res = await fetch(API_ROUTE.category + "/" + slug).then((res) =>
//       res.json()
//     );
//     return res.data as Category;
//   } catch (e) {
//     console.log(e);
//   }
// };

// export const categoryService = { getCategoryOverview, getCategoryBySlug };
