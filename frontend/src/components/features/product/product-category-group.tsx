import ProductList from "@/components/features/product/product-list";
import { ROUTE } from "@/constants/routes";
import { Category } from "@/libs/models/category";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import Link from "next/link";
import React from "react";

interface ProductCatergoryGroupProps {
  catergory: Category;
}

export default function ProductCategoryGroup({
  catergory,
}: ProductCatergoryGroupProps) {
  return (
    <div className="rounded-md shadow-md bg-white mb-4 p-2">
      {/* Title */}
      <div className="flex justify-between items-center px-4 py-2 border-b-2 mb-2">
        <Link
          href={`${ROUTE.category}/${catergory.slug}`}
          className="font-bold text-primary"
        >
          {catergory.name}
        </Link>
        <HoverCard openDelay={0} closeDelay={20}>
          <HoverCardTrigger className="cursor-pointer hover:text-primary px-3 font-bold text-sm">
            Xem thêm
          </HoverCardTrigger>
          <HoverCardContent
            align="end"
            className="shadow-lg rounded-md p-2 box-border bg-white"
          >
            <ul
              className={`grid ${
                (catergory.children?.length as number) < 4
                  ? "grid-cols-" + catergory.children?.length
                  : "grid-cols-4"
              } space-x-4 py-2`}
            >
              {!!catergory.children
                ? catergory.children.map((lv2) => (
                    <Link
                      key={lv2.id}
                      href={`${ROUTE.category}/${lv2.slug}`}
                      className="border-l-2 px-1"
                    >
                      {lv2.name}
                    </Link>
                  ))
                : null}
            </ul>
          </HoverCardContent>
        </HoverCard>
      </div>
      {/* Product List */}
      <ProductList
        products={catergory?.children?.at(1)?.children?.at(1)?.products}
      ></ProductList>
    </div>
  );
}
