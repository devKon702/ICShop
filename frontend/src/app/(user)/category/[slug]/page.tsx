import SetBreadCrump from "@/components/common/set-breadcrump";
import SelectedAttributeValueFilter from "@/components/features/filter/selected-attribute-filter";
import SideAttributeFilter from "@/components/features/filter/side-attribute-filter";
import SideCategoryFilter from "@/components/features/filter/side-category-filter";
import ProductPagination from "@/components/features/product/product-pagination";
import { ROUTE } from "@/constants/routes";
import { FilterProvider } from "@/libs/contexts/FilterContext";
import { Category } from "@/libs/models/category";
import { categoryService } from "@/libs/services/category-service";
import { Breadcrump } from "@/types/breadcrump";
import { notFound } from "next/navigation";
import React from "react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    attrids: string | undefined;
    name: string | undefined;
    page: string | undefined;
    limit: string | undefined;
  }>;
}

function generateBreadcump(category: Category) {
  // Tạo danh sách breadcrump
  const breadcrumps: Breadcrump[] = [
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

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { attrids, name, page, limit } = await searchParams;
  const category = await categoryService.getCategoryBySlug(slug);
  if (!category) notFound();
  else {
    const breadcrumps = generateBreadcump(category);
    return (
      <FilterProvider>
        <div className="flex flex-col space-y-4">
          <SetBreadCrump breadcrumps={breadcrumps}></SetBreadCrump>
          <div className="grid grid-cols-12 space-x-4">
            <div className="col-span-3 space-y-4">
              {category?.level !== 3 ? (
                category.children && (
                  <SideCategoryFilter
                    categories={category.children}
                  ></SideCategoryFilter>
                )
              ) : (
                <SideAttributeFilter
                  attributes={category.attributes || []}
                ></SideAttributeFilter>
              )}
            </div>
            <div className="col-span-9 space-y-2">
              <SelectedAttributeValueFilter></SelectedAttributeValueFilter>
              <ProductPagination
                categorySlug={slug}
                attrids={attrids}
                page={page}
                limit={limit}
                name={name}
              ></ProductPagination>
            </div>
          </div>
        </div>
      </FilterProvider>
    );
  }
}
