import ProductCard from "@/components/features/product/user/product-card";
import React from "react";

interface ProductListProps {
  products: {
    id: number;
    name: string;
    posterUrl: string;
    price: number;
    slug: string;
  }[];
  cols?: number;
}

export default function ProductList({
  products = [],
  cols = 5,
}: ProductListProps) {
  const colsClass =
    {
      1: "md:grid-cols-1",
      4: "md:grid-cols-4",
      5: "md:grid-cols-5",
    }[cols] || "grid-cols-5";
  return (
    <div className={`grid grid-cols-2 gap-4 ${colsClass}`}>
      {products.map((item) => (
        <ProductCard key={item.id} product={item}></ProductCard>
      ))}
    </div>
  );
}
