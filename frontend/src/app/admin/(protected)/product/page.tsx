"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import productService from "@/libs/services/product.service";
import { toast } from "sonner";
import categoryService from "@/libs/services/category.service";
import { useModalActions } from "@/store/modal-store";
import SearchCombobox from "@/components/common/search-combobox";
import env from "@/constants/env";
import SafeImage from "@/components/common/safe-image";
import { Check, Info, Pencil, Plus, Trash } from "lucide-react";
import { formatPrice } from "@/utils/number";
import ClampText from "@/components/common/clamp-text";

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
    <div className="p-4 space-y-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          {/* <Label className="mb-2">Tìm kiếm sản phẩm</Label> */}
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
          {isLoading && !productData ? null : (
            <>
              {productData?.data.result.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <SafeImage
                      src={`${env.NEXT_PUBLIC_FILE_URL}/${product.posterUrl}`}
                      alt="Poster"
                      width={40}
                      height={40}
                    />
                  </TableCell>
                  <TableCell>
                    <ClampText
                      className="cursor-pointer hover:underline w-fit"
                      lines={1}
                      text={product.name}
                    />
                  </TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{formatPrice(Number(product.price))}đ</TableCell>
                  <TableCell>
                    {product.isActive ? (
                      <Check className="p-1 rounded-full bg-primary text-white" />
                    ) : (
                      <Check className="p-1 rounded-full bg-gray-200 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center items-center">
                      <Pencil className="cursor-pointer p-1" />
                      {/* <Info className="cursor-pointer p-1" /> */}
                      <Trash className="cursor-pointer p-1 text-red-400 hover:text-red-600" />
                      <Info className="cursor-pointer p-1" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
      {productData && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setQuery((q) => ({ ...q, page: Math.max(q.page - 1, 1) }))
                }
              />
            </PaginationItem>
            <PaginationItem>
              Trang {query.page} /{" "}
              {Math.ceil(productData.data.total / productData.data.limit)}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setQuery((q) => ({
                    ...q,
                    page: Math.min(
                      q.page + 1,
                      Math.ceil(productData.data.total / productData.data.limit)
                    ),
                  }))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct?.id ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4 max-h-96 app overflow-y-auto">
              <div>
                <Label>Tên sản phẩm</Label>
                <Input defaultValue={selectedProduct.name} />
              </div>
              <div>
                <Label>Danh mục</Label>
                <Select
                  defaultValue={selectedProduct.categoryId?.toString() || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c.id !== 0)
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>VAT</Label>
                <Input type="number" defaultValue={selectedProduct.vat} />
              </div>
              <div>
                <Label>Mô tả</Label>
                <Textarea></Textarea>
              </div>
              <div>
                <Label>Bảng giá sỉ</Label>
                <div className="grid gap-2">
                  {selectedProduct.wholesales?.map((w, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        type="number"
                        defaultValue={w.min}
                        className="w-20"
                        placeholder="Từ"
                      />
                      <Input
                        type="number"
                        defaultValue={w.max}
                        className="w-20"
                        placeholder="Đến"
                      />
                      <Input
                        type="number"
                        defaultValue={w.price}
                        className="w-32"
                        placeholder="Giá"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>
              Huỷ
            </Button>
            <Button>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
