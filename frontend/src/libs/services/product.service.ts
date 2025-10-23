import apiAxios from "@/libs/api/api-axios";
import { apiFetch } from "@/libs/api/api-fetch";
import {
  AttributeValueBaseSchema,
  SafeAttributeValueSchema,
} from "@/libs/schemas/attribute-value.schema";
import {
  AttributeBaseSchema,
  SafeAttributeSchema,
} from "@/libs/schemas/attribute.schema";
import {
  CategoryBaseSchema,
  SafeCategoryBaseSchema,
} from "@/libs/schemas/category.schema";
import {
  ProductAttributeBaseSchema,
  SafeProductAttributeSchema,
} from "@/libs/schemas/product-attribute.schema";
import {
  ProductImageBaseSchema,
  SafeProductImageSchema,
} from "@/libs/schemas/product-image.schema";
import {
  FilterProductSchema,
  ProductBaseSchema,
  SafeProductBaseSchema,
} from "@/libs/schemas/product.schema";
import {
  ApiResponseSchema,
  PaginatedResponseSchema,
} from "@/libs/schemas/response.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
import {
  SafeWholesaleDetailSchema,
  WholesaleDetailBaseSchema,
} from "@/libs/schemas/wholesale-detail.schema";
import {
  SafeWholesaleBaseSchema,
  WholesaleBaseSchema,
} from "@/libs/schemas/wholesale.schema";
import { axiosHandler, fetchHandler } from "@/utils/response-handler";
import { z } from "zod";

type WholesaleType = {
  min_quantity: number;
  max_quantity: number;
  unit: string;
  quantity_step: number;
  vat: number;
  details: {
    min: number;
    max: number | null;
    price: number;
    desc: string;
  }[];
};

type ProductType = {
  name: string;
  categoryId: number;
  desc: string | null;
  datasheetLink: string | null;
  weight: number;
  wholesale: WholesaleType;
  valueIds: number[];
};

const productService = {
  admin: {
    getById: (productId: number) =>
      axiosHandler(
        apiAxios.get("/v1/admin/product/" + productId),
        ApiResponseSchema(
          ProductBaseSchema.extend({
            category: CategoryBaseSchema,
            creator: UserBaseSchema,
            modifier: UserBaseSchema,
            images: z.array(ProductImageBaseSchema),
            wholesale: WholesaleBaseSchema.extend({
              details: z.array(WholesaleDetailBaseSchema),
            }),
            attributes: z.array(
              ProductAttributeBaseSchema.extend({
                attributeValue: AttributeValueBaseSchema.extend({
                  attribute: AttributeBaseSchema,
                }),
              })
            ),
          })
        )
      ),
    filter: async (params: {
      name: string;
      cid: number | null;
      page: number;
      limit: number;
      order:
        | "price_asc"
        | "price_desc"
        | "name_asc"
        | "name_desc"
        | "date_asc"
        | "date_desc";
      active: 0 | 1 | null;
    }) => {
      const { name, cid, order, active, limit, page } = params;
      const query = new URLSearchParams();
      if (name) query.set("name", name);
      if (cid) query.set("cid", cid.toString());
      if (order) query.set("order", order);
      if (active) query.set("active", active.toString());
      if (limit) query.set("limit", limit.toString());
      if (page) query.set("page", page.toString());
      return axiosHandler(
        apiAxios.get("/v1/admin/product?" + query.toString()),
        PaginatedResponseSchema(FilterProductSchema)
      );
    },
    create: async (data: ProductType) => {
      return axiosHandler(
        apiAxios.post("/v1/admin/product", data),
        ApiResponseSchema(
          ProductBaseSchema.extend({
            attributes: z.array(ProductAttributeBaseSchema),
            creator: UserBaseSchema,
            wholesale: WholesaleBaseSchema.extend({
              details: z.array(WholesaleDetailBaseSchema),
            }),
          })
        )
      );
    },

    updatePoster: async (productId: number, poster: File) => {
      const formData = new FormData();
      formData.append("poster", poster);
      return axiosHandler(
        apiAxios.patch(`/v1/admin/product/${productId}/poster`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        ApiResponseSchema(
          ProductBaseSchema.extend({ modifier: UserBaseSchema })
        )
      );
    },

    addImageGallery: async (productId: number, image: File) => {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("productId", productId.toString());
      return axiosHandler(
        apiAxios.post("/v1/gallery", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        ApiResponseSchema(ProductImageBaseSchema)
      );
    },

    deleteImageGallery: async (imageId: number) =>
      axiosHandler(
        apiAxios.delete("/v1/gallery/" + imageId),
        ApiResponseSchema(ProductImageBaseSchema)
      ),

    updateImageGallery: async (imageId: number, image: File) => {
      const formData = new FormData();
      formData.append("image", image);
      return axiosHandler(
        apiAxios.patch(`/v1/gallery/${imageId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        ApiResponseSchema(ProductImageBaseSchema)
      );
    },

    delete: async (productId: number) =>
      axiosHandler(
        apiAxios.delete("v1/admin/product/" + productId),
        ApiResponseSchema(z.undefined())
      ),

    updateActive: async (productId: number, isActive: boolean) =>
      axiosHandler(
        apiAxios.patch("v1/admin/product/" + productId + "/lock", {
          isActive,
        }),
        ApiResponseSchema(
          ProductBaseSchema.extend({ modifier: UserBaseSchema })
        )
      ),

    updateBasic: async (
      productId: number,
      data: {
        name: string;
        desc: string | null;
        datasheetLink: string | null;
        weight: number;
      }
    ) =>
      axiosHandler(
        apiAxios.patch(`/v1/admin/product/${productId}/info`, data),
        ApiResponseSchema(
          ProductBaseSchema.extend({ modifier: UserBaseSchema })
        )
      ),

    updateCategory: async (
      productId: number,
      data: { categoryId: number; vids: number[] }
    ) =>
      axiosHandler(
        apiAxios.patch(`/v1/admin/product/${productId}/category`, data),
        ApiResponseSchema(
          ProductBaseSchema.extend({
            modifier: UserBaseSchema,
            attributes: z.array(
              ProductAttributeBaseSchema.extend({
                atttributeValue: AttributeValueBaseSchema.extend({
                  attribute: AttributeBaseSchema.pick({ id: true, name: true }),
                }),
              })
            ),
          })
        )
      ),

    updateWholesale: async (
      productId: number,
      data: {
        min_quantity: number;
        max_quantity: number;
        unit: string;
        quantity_step: number;
        vat: number;
        details: {
          min: number;
          max: number | null;
          price: number;
          desc: string;
        }[];
      }
    ) =>
      axiosHandler(
        apiAxios.patch(`/v1/admin/product/${productId}/wholesale`, data),
        ApiResponseSchema(
          ProductBaseSchema.extend({
            modifier: UserBaseSchema,
            wholesale: WholesaleBaseSchema.extend({
              details: z.array(WholesaleDetailBaseSchema),
            }),
          })
        )
      ),
  },

  user: {
    getBySlug: (slug: string) =>
      fetchHandler(
        apiFetch("/v1/product/" + slug),
        ApiResponseSchema(
          SafeProductBaseSchema.extend({
            wholesale: SafeWholesaleBaseSchema.extend({
              details: z.array(SafeWholesaleDetailSchema),
            }),
            attributes: z.array(
              SafeProductAttributeSchema.extend({
                attributeValue: SafeAttributeValueSchema.extend({
                  attribute: SafeAttributeSchema,
                }),
              })
            ),
            images: z.array(SafeProductImageSchema),
            category: SafeCategoryBaseSchema.extend({
              parent: SafeCategoryBaseSchema.extend({
                parent: SafeCategoryBaseSchema,
              }),
            }),
          })
        )
      ),
  },
};

// name: z.string().nonempty(),
//     categoryId: z.number(),
//     desc: z.string().nullable(),
//     datasheetLink: z.string().max(250, "Tối đa 250 kí tự").nullable(),
//     weight: z
//       .number()
//       .int("Phải là kiểu số nguyên")
//       .min(0, "Cân nặng tối thiểu 0 gram")
//       .max(1000 * 1000, "Cân nặng tối đa 1 tấn"),
//     wholesale: wholesaleSchema,
//     valueIds: z.array(
//       z.number().int("ID là kiểu số nguyên").min(1, "ID không hợp lệ")
//     ),
// const getProductBySlug = async (slug: string) => {
//   try {
//     const res = await fetch(API_ROUTE.product + "/" + slug).then((res) =>
//       res.json()
//     );
//     return res.data as Product;
//   } catch (e) {
//     console.log(e);
//   }
// };

// const filterProduct = async (
//   categorySlug: string,
//   attrids: string = "",
//   name: string = "",
//   page: number = 1,
//   limit: number = 10
// ) => {
//   console.log(
//     API_ROUTE.product +
//       `/category/${categorySlug}?attrids=${attrids}&name=${name}&page=${page}&limit=${limit}`
//   );
//   try {
//     const res: PaginationResponse<Product[]> = await fetch(
//       API_ROUTE.product +
//         `/category/${categorySlug}?attrids=${attrids}&name=${name}&page=${page}&limit=${limit}`
//     ).then((res) => res.json());
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// };

// const getProductByCategoryId = async (
//   categoryId: number,
//   page: number = 1,
//   limit: number = 10
// ) => {
//   try {
//     const res = await fetch(
//       API_ROUTE.product +
//         "/category/" +
//         categoryId +
//         `?page=${page}&limit=${limit}`
//     ).then((res) => res.json());
//     return res as PaginationResponse<Product[]>;
//   } catch (e) {
//     console.log(e);
//   }
// };

export default productService;
