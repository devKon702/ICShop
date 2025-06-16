import { ROUTE } from "@/constants/routes";
import { Category } from "@/libs/models/category";
import Link from "next/link";
import React from "react";

interface SideCategoryFilterProps {
  categories: Category[];
}

export default function SideCategoryFilter({
  categories,
}: SideCategoryFilterProps) {
  return (
    <div className="flex flex-col w-full items-start bg-white shadow-xl rounded-sm overflow-hidden">
      <p className="font-bold px-4 py-2 bg-primary w-full">Danh mục</p>
      <ul className="p-2 w-full flex flex-col">
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`${ROUTE.category}/${item.slug}`}
            className="p-2 hover:text-primary hover:bg-primary-light cursor-pointer"
          >
            {item.name}
          </Link>
        ))}
      </ul>
    </div>
  );
}
