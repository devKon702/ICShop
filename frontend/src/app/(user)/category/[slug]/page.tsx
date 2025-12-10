import ClampText from "@/components/common/clamp-text";
import OrderSelector from "@/components/common/order-selector";
import SetBreadCrump from "@/components/common/set-breadcrump";
import SelectedAttributeValueFilter from "@/components/features/filter/selected-attribute-filter";
import SideAttributeFilter from "@/components/features/filter/side-attribute-filter";
import SideCategoryFilter from "@/components/features/filter/side-category-filter";
import ProductPagination from "@/components/features/product/product-pagination";
import { ROUTE } from "@/constants/routes";
import { AttributeFilterProvider } from "@/libs/contexts/AttributeFilterContext";
import categoryService from "@/libs/services/category.service";
import { FolderIcon, Search } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsStringLiteral,
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
  vids: parseAsArrayOf(parseAsInteger).withDefault([]),
  order: parseAsStringLiteral(["price_asc", "price_desc"]).withDefault(
    "price_asc"
  ),
});

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  await queryCache.parse(searchParams);
  const { page, limit, vids, order } = queryCache.all();
  const { data: category } = await categoryService.getBySlug({
    slug,
    page,
    limit,
    order,
    vids,
  });
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
                  <SideCategoryFilter data={category.children} />
                )
              ) : (
                <SideAttributeFilter attributes={category.attributes || []} />
              )}
            </div>
            <div className="col-span-9 space-y-2">
              {category.level === 3 ? (
                <>
                  <SelectedAttributeValueFilter />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold opacity-50 text-sm px-2">
                      {category.products.length} sản phẩm
                    </span>
                    <OrderSelector
                      data={[
                        { value: "price_asc", label: "Giá Thấp Đến Cao" },
                        { value: "price_desc", label: "Giá Cao Đến Thấp" },
                      ]}
                      defaultValue={order}
                      className="ms-auto"
                    />
                  </div>
                  {category.products.length === 0 ? (
                    <div className="w-full h-40 flex flex-col items-center justify-center bg-white rounded-md space-y-2 shadow">
                      <Search strokeWidth={4} className="opacity-50" />
                      <span className="font-semibold opacity-50">
                        Không tìm thấy sản phẩm nào
                      </span>
                    </div>
                  ) : (
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
                    />
                  )}
                </>
              ) : (
                <>
                  {category.children.length > 0 && (
                    <div className="bg-white p-4 rounded-md shadow">
                      <h2 className="font-semibold text-lg mb-4">
                        Danh mục con
                      </h2>
                      <div className="grid grid-cols-3 gap-4">
                        {category.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/category/${child.slug}`}
                            className="flex space-x-2 hover:bg-primary/10 p-2 rounded-md items-center"
                          >
                            <FolderIcon />
                            <ClampText lines={1} text={child.name} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </AttributeFilterProvider>
    );
  }
}
