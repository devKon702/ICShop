"use client";
import ProductList from "@/components/features/product/product-list";
import React, { useState } from "react";
const showcaseData = [
  {
    id: 0,
    title: "Nổi bật",
    products: [
      {
        id: 1,
        name: "Điện trở 20 ômfasdfasd klfjlkasd jflkja sdlkf jlkasdj flkasdj",
        image: "/uploads/ic-1.png",
        price: 999000,
      },
      {
        id: 2,
        name: "Điện trở 20 ôm",
        image: "/uploads/ic-1.png",
        price: 999000,
      },
      {
        id: 3,
        name: "Điện trở 20 ôm",
        image: "/uploads/ic-1.png",
        price: 999000,
      },
      {
        id: 4,
        name: "Điện trở 20 ôm",
        image: "/uploads/ic-1.png",
        price: 999000,
      },
    ],
  },
  {
    id: 1,
    title: "Mới về",
    products: [
      {
        id: 1,
        name: "Điện trở 30 ôm",
        image: "/uploads/ic-1.png",
        price: 999000,
      },
      {
        id: 2,
        name: "Điện trở 30 ôm",
        image: "/uploads/ic-1.png",
        price: 999000,
      },
      {
        id: 3,
        name: "Điện trở 30 ôm",
        image: "/uploads/ic-1.png",
        price: 999000,
      },
      {
        id: 4,
        name: "Điện trở 30 ôm",
        image: "/uploads/ic-1.png",
        price: 999000,
      },
    ],
  },
  {
    id: 2,
    title: "Bán chạy",
    products: [
      {
        id: 1,
        name: "Điện trở 10 ôm",
        image: "/uploads/ic-1.png",
        price: 999000,
      },
      {
        id: 2,
        name: "Điện trở 10 ôm",
        image: "/uploads/ic-1.png",
        price: 999000,
      },
      {
        id: 3,
        name: "Điện trở 10 ôm",
        image: "/uploads/ic-1.png",
        price: 999000,
      },
      {
        id: 4,
        name: "Điện trở 10 ôm",
        image: "/uploads/ic-1.png",
        price: 999000,
      },
    ],
  },
];

export default function ProductShowcase() {
  const [showcase, setShowcase] = useState<number>(0);
  return (
    <div className="bg-white p-4 rounded-md my-2 shadow-xl">
      {/* Title bar */}
      <div className="grid grid-cols-3 mb-4 bg-white uppercase">
        {showcaseData.map((item) => (
          <p
            key={item.id}
            className={`text-center cursor-pointer py-2 border-b-3 border-transparent hover:text-primary hover:border-b-primary ${
              showcase === item.id ? "text-primary border-b-primary" : ""
            }`}
            onClick={() => {
              if (item.id != showcase) setShowcase(item.id);
            }}
          >
            {item.title}
          </p>
        ))}
      </div>
      {/* Product List */}
      <ProductList products={[]}></ProductList>
    </div>
  );
}
