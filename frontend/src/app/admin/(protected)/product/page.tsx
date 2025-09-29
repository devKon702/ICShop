"use client";
import {
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import productService from "@/libs/services/product.service";
import { toast } from "sonner";
import categoryService from "@/libs/services/category.service";
import { useModalActions } from "@/store/modal-store";
import SearchCombobox from "@/components/common/search-combobox";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductRow from "@/components/features/product/admin/product-row";
import { Skeleton } from "@/components/ui/skeleton";
import AppPagination from "@/components/common/app-pagination";

export default function ProductManagementPage() {
  const { closeModal, openModal } = useModalActions();

  const [query, setQuery] = useQueryStates({
    name: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    cid: parseAsInteger,
    order: parseAsStringEnum([
      "name_asc",
      "name_desc",
      "price_asc",
      "price_desc",
      "date_asc",
      "date_desc",
    ]).withDefault("date_desc"),
    active: parseAsNumberLiteral([0, 1]),
  });

  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", { ...query }],
    queryFn: async () => productService.filter({ ...query }),
  });
  const { data: categoryData } = useQuery({
    queryKey: ["categories", { level: 3 }],
    queryFn: categoryService.getLeafCagory,
  });

  if (isError) {
    toast.error("Lỗi lọc sản phẩm");
    return null;
  }

  return (
    <div className="p-4 space-y-4 flex flex-col">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Tên sản phẩm..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setQuery({ ...query, name: e.currentTarget.value, page: 1 });
              }
            }}
          />
        </div>
        {categoryData && (
          <div>
            <SearchCombobox
              list={[
                { value: "null", label: "Tất cả" },
                ...categoryData.data.map((item) => ({
                  value: item.id.toString(),
                  label: item.name,
                })),
              ]}
              initialValue={query.cid?.toString() || "null"}
              searchPlaceholder="Danh mục"
              onItemSelect={(item) => {
                setQuery({
                  ...query,
                  cid: item.value === "null" ? null : Number(item.value),
                  page: 1,
                });
              }}
            ></SearchCombobox>
          </div>
        )}

        <Button
          onClick={() => {
            openModal({
              type: "createProduct",
              props: {
                onSuccess: () => closeModal(),
                categories: categoryData?.data || [],
              },
            });
          }}
        >
          <Plus />
          <span>Sản phẩm</span>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Đơn giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 2 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <TableCell key={i}>
                        <Skeleton className="w-full h-6" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : productData?.data.result.map((product) => (
                  <ProductRow key={product.id} product={product}></ProductRow>
                ))}
          </TableBody>
        </Table>
        {productData && (
          <AppPagination
            currentPage={query.page}
            totalPage={Math.ceil(
              productData.data.total / productData.data.limit
            )}
          ></AppPagination>
        )}
      </div>
    </div>
  );
}
