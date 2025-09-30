import apiClient from "@/libs/axios/api-client";
import apiPublic from "@/libs/axios/api-public";
import { SafeAttributeValueSchema } from "@/libs/schemas/attribute-value.schema";
import { SafeAttributeSchema } from "@/libs/schemas/attribute.schema";
import {
  AdminCategoryTreeSchema,
  CategoryBaseSchema,
  CreateCategorySchema,
  SafeCategory,
  SafeCategoryTree,
} from "@/libs/schemas/category.schema";
import { SafeProduct } from "@/libs/schemas/product.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import requestHandler from "@/utils/request-handler";
import { z } from "zod";

const categoryService = {
  // Admin
  create: async (name: string, parentId?: number) =>
    requestHandler(
      apiClient.post("/v1/admin/category", { name, parentId }),
      ApiResponseSchema(CreateCategorySchema)
    ),

  update: async (id: number, name: string) =>
    requestHandler(
      apiClient.put("/v1/admin/category/" + id, { name }),
      ApiResponseSchema(CategoryBaseSchema)
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

  // User
  getTree: async () =>
    requestHandler(
      apiPublic.get("/v1/category"),
      ApiResponseSchema(SafeCategoryTree)
    ),
  getBySlug: async (
    slug: string,
    page: number,
    limit: number,
    order: "price_asc" | "price_desc" = "price_asc"
  ) => {
    const query = new URLSearchParams();
    query.set("page", page.toString());
    query.set("limit", limit.toString());
    query.set("order", order);

    return requestHandler(
      apiPublic.get(`v1/category/${slug}?${query.toString()}`),
      ApiResponseSchema(
        SafeCategory.extend({
          _count: z.object({ products: z.number() }),
          products: z.array(
            SafeProduct.omit({
              desc: true,
              weight: true,
              categoryId: true,
              datasheetLink: true,
            })
          ),
          parent: SafeCategory.extend({
            parent: SafeCategory.nullable(),
          }).nullable(),
          children: z.array(
            SafeCategory.extend({
              children: z.array(SafeCategory),
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
