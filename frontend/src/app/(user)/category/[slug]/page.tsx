import SetBreadCrump from "@/components/common/set-breadcrump";
import SelectedAttributeValueFilter from "@/components/features/filter/selected-attribute-filter";
import SideAttributeFilter from "@/components/features/filter/side-attribute-filter";
import SideCategoryFilter from "@/components/features/filter/side-category-filter";
import ProductPagination from "@/components/features/product/product-pagination";
import { ROUTE } from "@/constants/routes";
import { AttributeFilterProvider } from "@/libs/contexts/AttributeFilterContext";
import categoryService from "@/libs/services/category.service";
import { notFound } from "next/navigation";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  SearchParams,
} from "nuqs/server";
import React from "react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<SearchParams>;
}

type breadcrumpDataType = {
  name: string;
  slug: string;
  parent: breadcrumpDataType | null;
  [key: string]: unknown;
};

function generateBreadcrump(category: breadcrumpDataType) {
  // Tạo danh sách breadcrump
  const breadcrumps = [
    { label: category.name, href: ROUTE.category + "/" + category.slug },
  ];
  if (category.parent)
    breadcrumps.unshift({
      label: category.parent.name,
      href: ROUTE.category + "/" + category.parent.slug,
    });
  if (category.parent?.parent)
    breadcrumps.unshift({
      label: category.parent.parent.name,
      href: ROUTE.category + "/" + category.parent.parent.slug,
    });
  breadcrumps.unshift({ label: "Trang chủ", href: ROUTE.home });
  return breadcrumps;
}

const queryCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
  name: parseAsString,
  attrids: parseAsString,
});

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  await queryCache.parse(searchParams);
  const { attrids, name, page, limit } = queryCache.all();
  const { data: category } = await categoryService.getBySlug(
    slug,
    Number(page),
    Number(limit),
    "price_asc"
  );
  if (!category) notFound();
  else {
    const breadcrumps = generateBreadcrump(category as breadcrumpDataType);
    return (
      <AttributeFilterProvider>
        <div className="flex flex-col space-y-4">
          <SetBreadCrump breadcrumps={breadcrumps}></SetBreadCrump>
          <div className="grid grid-cols-12 space-x-4">
            <div className="col-span-3 space-y-4">
              {category.level !== 3 ? (
                category.children && (
                  <SideCategoryFilter
                    data={category.children}
                  ></SideCategoryFilter>
                )
              ) : (
                <SideAttributeFilter
                  data={category.attributes || []}
                ></SideAttributeFilter>
              )}
            </div>
            <div className="col-span-9 space-y-2">
              <SelectedAttributeValueFilter></SelectedAttributeValueFilter>
              <ProductPagination
                page={Number(page)}
                limit={Number(limit)}
                total={category._count.products}
                products={
                  category.products.map((item) => ({
                    id: item.id,
                    name: item.name,
                    posterUrl: item.posterUrl || "",
                    price: Number(item.price),
                    slug: item.slug,
                  })) || []
                }
              ></ProductPagination>
            </div>
          </div>
        </div>
      </AttributeFilterProvider>
    );
  }
}
