import apiClient from "@/libs/axios/api-client";
import { AttributeBaseSchema } from "@/libs/schemas/attribute.schema";
import { ProductImageBaseSchema } from "@/libs/schemas/product-image.schema";
import {
  FilterProductSchema,
  ProductBaseSchema,
} from "@/libs/schemas/product.schema";
import {
  ApiResponseSchema,
  PaginatedResponseSchema,
} from "@/libs/schemas/response.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
import { WholesaleDetailBaseSchema } from "@/libs/schemas/wholesale-detail.schema";
import { WholesaleBaseSchema } from "@/libs/schemas/wholesale.schema";
import requestHandler from "@/utils/request-handler";
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
  filter: async (params: {
    name?: string;
    cid?: number;
    page?: number;
    limit?: number;
    order?: "price_asc" | "price_desc" | "none";
    active?: 0 | 1;
  }) => {
    const { name, cid, order, active, limit, page } = params;
    const query = new URLSearchParams();
    if (name) query.set("name", name);
    if (cid) query.set("cid", cid.toString());
    if (order) query.set("order", order);
    if (active) query.set("active", active.toString());
    if (limit) query.set("limit", limit.toString());
    if (page) query.set("page", page.toString());
    return requestHandler(
      apiClient.get("/v1/admin/product?" + query.toString()),
      PaginatedResponseSchema(FilterProductSchema)
    );
  },
  create: async (data: ProductType) => {
    return requestHandler(
      apiClient.post("/v1/admin/product", data),
      ApiResponseSchema(
        ProductBaseSchema.extend({
          attributes: z.array(AttributeBaseSchema),
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
    return requestHandler(
      apiClient.patch(`/v1/admin/product/${productId}/poster`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
      ApiResponseSchema(ProductBaseSchema.extend({ modifier: UserBaseSchema }))
    );
  },

  addImageGallery: async (productId: number, image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("productId", productId.toString());
    return requestHandler(
      apiClient.post("/v1/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
      ApiResponseSchema(ProductImageBaseSchema)
    );
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
