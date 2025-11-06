import apiAxios from "@/libs/api/api-axios";
import { apiFetch } from "@/libs/api/api-fetch";
import { CategoryBaseSchema } from "@/libs/schemas/category.schema";
import {
  CollectionBaseSchema,
  SafeCollectionBaseSchema,
} from "@/libs/schemas/collection.schema";
import {
  ProductCollectionBaseSchema,
  SafeProductCollectionBaseSchema,
} from "@/libs/schemas/product-collection";
import {
  ProductBaseSchema,
  SafeProductBaseSchema,
} from "@/libs/schemas/product.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { axiosHandler, fetchHandler } from "@/utils/response-handler";
import { z } from "zod";

const collectionService = {
  admin: {
    create: (data: {
      name: string;
      desc?: string;
      isActive?: boolean;
      position?: number;
    }) =>
      axiosHandler(
        apiAxios.post("/v1/admin/collections", data),
        ApiResponseSchema(CollectionBaseSchema)
      ),
    update: (
      id: number,
      data: {
        name?: string;
        desc?: string;
        isActive?: boolean;
        position?: number;
      }
    ) =>
      axiosHandler(
        apiAxios.patch("/v1/admin/collections/" + id, data),
        ApiResponseSchema(CollectionBaseSchema)
      ),

    delete: (id: number) =>
      axiosHandler(
        apiAxios.delete("/v1/admin/collections/" + id),
        ApiResponseSchema(CollectionBaseSchema)
      ),

    getAll: () =>
      axiosHandler(
        apiAxios.get("/v1/admin/collections"),
        ApiResponseSchema(z.array(CollectionBaseSchema))
      ),

    getAllWithProducts: () =>
      axiosHandler(
        apiAxios.get("/v1/admin/collections/products"),
        ApiResponseSchema(
          z.array(
            CollectionBaseSchema.extend({
              productCollections: z.array(
                ProductCollectionBaseSchema.extend({
                  product: ProductBaseSchema.omit({ desc: true }).extend({
                    category: CategoryBaseSchema,
                  }),
                })
              ),
            })
          )
        )
      ),

    addProduct: (data: { collectionId: number; productId: number }) =>
      axiosHandler(
        apiAxios.post("/v1/admin/collections/" + data.collectionId, {
          productId: data.productId,
        }),
        ApiResponseSchema(ProductCollectionBaseSchema)
      ),

    removeProduct: (productCollectionId: number) =>
      axiosHandler(
        apiAxios.delete("/v1/admin/product-collections/" + productCollectionId),
        ApiResponseSchema(ProductCollectionBaseSchema)
      ),
  },
  user: {
    getAll: (limit?: number) => {
      const query = new URLSearchParams();
      if (limit) {
        query.append("limit", limit.toString());
      }
      return fetchHandler(
        apiFetch("/v1/collections?" + query.toString()),
        ApiResponseSchema(
          z.array(
            SafeCollectionBaseSchema.extend({
              productCollections: z.array(
                SafeProductCollectionBaseSchema.extend({
                  product: SafeProductBaseSchema.omit({ desc: true }),
                })
              ),
            })
          )
        )
      );
    },
  },
};

export default collectionService;
