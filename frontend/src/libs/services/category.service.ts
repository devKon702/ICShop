import apiAxios from "@/libs/api/api-axios";
import { apiFetch } from "@/libs/api/api-fetch";

import { SafeAttributeValueSchema } from "@/libs/schemas/attribute-value.schema";
import { SafeAttributeSchema } from "@/libs/schemas/attribute.schema";
import {
  AdminCategoryTreeSchema,
  CategoryBaseSchema,
  CreateCategorySchema,
  SafeCategoryBaseSchema,
  SafeCategoryTreeSchema,
} from "@/libs/schemas/category.schema";
import { SafeProductBaseSchema } from "@/libs/schemas/product.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { axiosHandler, fetchHandler } from "@/utils/response-handler";
import { z } from "zod";

const categoryService = {
  // Admin
  create: async (name: string, parentId?: number) =>
    axiosHandler(
      apiAxios.post("/v1/admin/category", { name, parentId }),
      ApiResponseSchema(CreateCategorySchema)
    ),

  update: async (id: number, name: string) =>
    axiosHandler(
      apiAxios.put("/v1/admin/category/" + id, { name }),
      ApiResponseSchema(CategoryBaseSchema)
    ),

  delete: async (id: number) =>
    axiosHandler(
      apiAxios.delete("/v1/admin/category/" + id),
      ApiResponseSchema(z.null().optional())
    ),

  getAllCategory4Admin: async () =>
    axiosHandler(
      apiAxios.get("/v1/admin/category"),
      ApiResponseSchema(AdminCategoryTreeSchema)
    ),

  getLeafCategory: async () =>
    axiosHandler(
      apiAxios.get("/v1/admin/category/leaf"),
      ApiResponseSchema(z.array(CategoryBaseSchema))
    ),

  // User
  getTree: async () =>
    fetchHandler(
      apiFetch("/v1/category"),
      ApiResponseSchema(SafeCategoryTreeSchema)
    ),
  getBySlug: async ({
    slug,
    vids = [],
    page,
    limit,
    order = "price_asc",
  }: {
    slug: string;
    vids: number[];
    page: number;
    limit: number;
    order: "price_asc" | "price_desc";
  }) => {
    const query = new URLSearchParams();
    query.set("page", page.toString());
    query.set("limit", limit.toString());
    query.set("order", order);
    if (vids.length > 0) query.set("vids", vids.join(","));

    return fetchHandler(
      apiFetch(`/v1/category/${slug}?${query.toString()}`),
      ApiResponseSchema(
        SafeCategoryBaseSchema.extend({
          _count: z.object({ products: z.number() }),
          products: z.array(
            SafeProductBaseSchema.omit({
              desc: true,
              weight: true,
              categoryId: true,
              datasheetLink: true,
            })
          ),
          parent: SafeCategoryBaseSchema.extend({
            parent: SafeCategoryBaseSchema.nullable(),
          }).nullable(),
          children: z.array(
            SafeCategoryBaseSchema.extend({
              children: z.array(SafeCategoryBaseSchema),
            })
          ),
          attributes: z.array(
            SafeAttributeSchema.omit({ categoryId: true }).extend({
              values: z.array(
                SafeAttributeValueSchema.omit({ attributeId: true })
              ),
            })
          ),
        })
      )
    );
  },
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
