import apiClient from "@/libs/axios/api-client";
import { FilterProductSchema } from "@/libs/schemas/product.schema";
import { PaginatedResponseSchema } from "@/libs/schemas/response.schema";
import requestHandler from "@/utils/request-handler";

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
};

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
