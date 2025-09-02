import { API_ROUTE } from "@/constants/api-route";
import { PaginationResponse } from "@/libs/models/pagination-response";
import { Product } from "@/libs/models/product";

const getProductBySlug = async (slug: string) => {
  try {
    const res = await fetch(API_ROUTE.product + "/" + slug).then((res) =>
      res.json()
    );
    return res.data as Product;
  } catch (e) {
    console.log(e);
  }
};

const filterProduct = async (
  categorySlug: string,
  attrids: string = "",
  name: string = "",
  page: number = 1,
  limit: number = 10
) => {
  console.log(
    API_ROUTE.product +
      `/category/${categorySlug}?attrids=${attrids}&name=${name}&page=${page}&limit=${limit}`
  );
  try {
    const res: PaginationResponse<Product[]> = await fetch(
      API_ROUTE.product +
        `/category/${categorySlug}?attrids=${attrids}&name=${name}&page=${page}&limit=${limit}`
    ).then((res) => res.json());
    return res;
  } catch (e) {
    console.log(e);
  }
};

const getProductByCategoryId = async (
  categoryId: number,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const res = await fetch(
      API_ROUTE.product +
        "/category/" +
        categoryId +
        `?page=${page}&limit=${limit}`
    ).then((res) => res.json());
    return res as PaginationResponse<Product[]>;
  } catch (e) {
    console.log(e);
  }
};

export const productService = {
  getProductBySlug,
  filterProduct,
  getProductByCategoryId,
};
