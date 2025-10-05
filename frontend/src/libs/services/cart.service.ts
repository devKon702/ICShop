import apiAxios from "@/libs/api/api-axios";
import { CartDetailSchema } from "@/libs/schemas/cart.schema";
import { SafeProductBaseSchema } from "@/libs/schemas/product.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { SafeWholesaleDetailSchema } from "@/libs/schemas/wholesale-detail.schema";
import { SafeWholesaleBaseSchema } from "@/libs/schemas/wholesale.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

const cartService = {
  getCart: () =>
    axiosHandler(
      apiAxios.get("/v1/cart"),
      ApiResponseSchema(
        z.array(
          CartDetailSchema.extend({
            product: SafeProductBaseSchema.pick({
              id: true,
              name: true,
              price: true,
              slug: true,
              posterUrl: true,
            }).extend({
              wholesale: SafeWholesaleBaseSchema.extend({
                details: z.array(SafeWholesaleDetailSchema),
              }),
            }),
          })
        )
      )
    ),
  add: (productId: number) =>
    axiosHandler(
      apiAxios.post("/v1/cart", { productId }),
      ApiResponseSchema(CartDetailSchema)
    ),
  deleteMulti: (ids: number[]) =>
    axiosHandler(
      apiAxios.delete(`/v1/cart`, { data: { cartIds: ids } }),
      ApiResponseSchema(z.array(z.object({ id: z.number() })))
    ),
};
export default cartService;
