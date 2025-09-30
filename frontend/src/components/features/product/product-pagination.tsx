import AppPagination from "@/components/common/app-pagination";
import ProductList from "@/components/features/product/product-list";
import React from "react";

interface ProductPaginationProps {
  products: {
    id: number;
    name: string;
    posterUrl: string;
    price: number;
    slug: string;
  }[];
  page: number;
  total: number;
  limit: number;
}

export default async function ProductPagination({
  products,
  page,
  total,
  limit,
}: ProductPaginationProps) {
  return (
    <div className="space-y-4">
      <ProductList products={products} cols={4}></ProductList>
      <AppPagination
        currentPage={page}
        totalPage={Math.ceil(total / limit)}
        isClientSide={false}
      ></AppPagination>
    </div>
  );
}
