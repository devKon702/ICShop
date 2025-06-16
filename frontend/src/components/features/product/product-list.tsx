import ProductCard from "@/components/features/product/product-card";
import { Product } from "@/libs/models/product";
import React from "react";

interface ProductListProps {
  products?: Product[];
  cols?: number;
}

export default function ProductList({
  products = [],
  cols = 5,
}: ProductListProps) {
  const colsClass =
    {
      1: "grid-cols-1",
      4: "grid-cols-4",
      5: "grid-cols-5",
    }[cols] || "grid-cols-5";
  return (
    <div className={`grid gap-4 ${colsClass}`}>
      {products.map((item) => (
        <ProductCard key={item.id} product={item}></ProductCard>
      ))}
    </div>
  );
}
