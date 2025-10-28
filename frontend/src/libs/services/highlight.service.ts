import { HighlightType } from "@/constants/enums";
import apiAxios from "@/libs/api/api-axios";
import {
  CategoryBaseSchema,
  SafeCategoryBaseSchema,
} from "@/libs/schemas/category.schema";
import { ProductHighlightBaseSchema } from "@/libs/schemas/product-highlight.schema";
import {
  ProductBaseSchema,
  SafeProductBaseSchema,
} from "@/libs/schemas/product.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

const highlightService = {
  admin: {
    add: async (productId: number, highlightType: HighlightType) =>
      axiosHandler(
        apiAxios.post(`/v1/admin/highlight`, { productId, highlightType }),
        ApiResponseSchema(
          ProductHighlightBaseSchema.extend({
            product: ProductBaseSchema.extend({ category: CategoryBaseSchema }),
          })
        )
      ),

    remove: async (highlightId: number) =>
      axiosHandler(
        apiAxios.delete(`/v1/admin/highlight/${highlightId}`),
        ApiResponseSchema(ProductHighlightBaseSchema)
      ),

    getAll: async () =>
      axiosHandler(
        apiAxios.get(`/v1/admin/highlight`),
        ApiResponseSchema(
          z.array(
            z.object({
              type: z.enum([
                HighlightType.NEW,
                HighlightType.HOT,
                HighlightType.BEST_SELL,
              ]),
              list: z.array(
                ProductBaseSchema.extend({ category: CategoryBaseSchema })
              ),
            })
          )
        )
      ),
  },
  user: {
    getAll: async () =>
      axiosHandler(
        apiAxios.get(`/v1/highlight`),
        ApiResponseSchema(
          z.array(
            z.object({
              type: z.enum([
                HighlightType.NEW,
                HighlightType.HOT,
                HighlightType.BEST_SELL,
              ]),
              list: z.array(
                SafeProductBaseSchema.extend({
                  category: SafeCategoryBaseSchema,
                })
              ),
            })
          )
        )
      ),
  },
};
export default highlightService;
