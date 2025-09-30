import { ROUTE } from "@/constants/routes";
import Link from "next/link";
import React from "react";

interface SideCategoryFilterProps {
  data: { id: number; slug: string; name: string }[];
}

export default function SideCategoryFilter({ data }: SideCategoryFilterProps) {
  return (
    <div className="flex flex-col w-full items-start bg-white shadow-xl rounded-sm overflow-hidden">
      <p className="font-bold px-4 py-2 bg-primary w-full">Danh mục</p>
      <ul className="p-2 w-full flex flex-col">
        {data.map((item) => (
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
