"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import Image from "next/image";
import { useModalActions } from "@/store/modal-store";
import SearchCombobox from "@/components/common/search-combobox";

export default function ProductManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { closeModal, openModal } = useModalActions();

  const [name, cid, order, active, limit, page] = [
    "",
    undefined,
    undefined,
    undefined,
    10,
    1,
  ];
  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", { name, cid, order, active, limit, page }],
    queryFn: async () =>
      productService.filter({ name, cid, order, active, limit, page }),
  });

  const { data: categoryData } = useQuery({
    queryKey: ["category", { level: 3 }],
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
          <Label>Tìm kiếm sản phẩm</Label>
          <Input
            placeholder="Tên, mã sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {categoryData && (
          <div>
            <SearchCombobox
              list={categoryData.data.map((item) => ({
                value: item.id.toString(),
                label: item.name,
              }))}
              searchPlaceholder="Danh mục"
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
          Tạo sản phẩm
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
                    <Image
                      src={product.posterUrl || ""}
                      alt="product poster"
                      width={40}
                      height={40}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{product.price.toLocaleString()}đ</TableCell>
                  <TableCell>{product.isActive ? "Hoạt động" : "Ẩn"}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Chi tiết
                    </Button>
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
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              />
            </PaginationItem>
            <PaginationItem>
              Trang {currentPage} /{" "}
              {Math.ceil(productData?.data.total / productData?.data.limit)}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(
                      p + 1,
                      Math.ceil(productData.data.total / productData.data.limit)
                    )
                  )
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
