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
        CartDetailSchema.extend({
          products: z.array(
            SafeProductBaseSchema.extend({
              wholesale: SafeWholesaleBaseSchema.extend({
                details: z.array(SafeWholesaleDetailSchema),
              }),
            }).omit({
              desc: true,
              datasheetLink: true,
              weight: true,
            })
          ),
        })
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
      ApiResponseSchema(CartDetailSchema)
    ),
};
export default cartService;
