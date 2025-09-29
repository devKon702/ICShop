import AppPagination from "@/components/common/app-pagination";
import ProductList from "@/components/features/product/product-list";
import productService from "@/libs/services/product.service";
import React from "react";

interface ProductPaginationProps {
  categorySlug: string;
  attrids: string | undefined;
  name: string | undefined;
  page: string | undefined;
  limit: string | undefined;
}

export default async function ProductPagination({
  categorySlug,
  attrids,
  limit = "10",
  name = "",
  page = "1",
}: ProductPaginationProps) {
  const response = await productService.filterProduct(
    categorySlug,
    attrids,
    name,
    Number(page),
    Number(limit)
  );
  console.log(response);
  if (!response?.data) return null;
  return (
    <div className="space-y-4">
      <ProductList products={response.data} cols={4}></ProductList>
      <AppPagination
        currentPage={response.page}
        totalPage={Math.ceil(response.total / response.limit)}
      ></AppPagination>
    </div>
  );
}
