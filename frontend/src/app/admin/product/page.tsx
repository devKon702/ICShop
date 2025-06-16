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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  { id: 0, name: "Tất cả" },
  { id: 1, name: "Vi mạch" },
  { id: 2, name: "Cảm biến" },
  { id: 3, name: "Nguồn điện" },
];

const mockProducts = [
  {
    id: 1,
    name: "Vi mạch ATmega328",
    categoryId: 1,
    slug: "vi-mach-atmega328",
    unit: "cái",
    vat: 10,
    minQuantity: 1,
    maxQuantity: 100,
    quantityStep: 1,
    isActive: true,
    wholesales: [
      { min: 1, max: 9, price: 20000 },
      { min: 10, max: 49, price: 18000 },
      { min: 50, max: 100, price: 16000 },
    ],
  },
  {
    id: 2,
    name: "Cảm biến nhiệt độ DHT11",
    categoryId: 2,
    slug: "cam-bien-dht11",
    unit: "cái",
    vat: 10,
    minQuantity: 1,
    maxQuantity: 50,
    quantityStep: 1,
    isActive: true,
    wholesales: [
      { min: 1, max: 9, price: 15000 },
      { min: 10, max: 29, price: 13000 },
      { min: 30, max: 50, price: 12000 },
    ],
  },
];

export default function ProductManagementPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = mockProducts.filter((product) => {
    const matchSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "0" ||
      product.categoryId === parseInt(selectedCategory);
    return matchSearch && matchCategory;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
        <div>
          <Label>Danh mục</Label>
          <Select onValueChange={setSelectedCategory} value={selectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setSelectedProduct({})}>Tạo sản phẩm</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã</TableHead>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>VAT</TableHead>
            <TableHead>Giá (1+)</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => {
            const category =
              categories.find((c) => c.id === product.categoryId)?.name || "-";
            const basePrice = product.wholesales?.[0]?.price || "-";
            return (
              <TableRow key={product.id}>
                <TableCell>{product.slug}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{category}</TableCell>
                <TableCell>{product.vat}%</TableCell>
                <TableCell>{basePrice.toLocaleString()}đ</TableCell>
                <TableCell>{product.isActive ? "Hoạt động" : "Ẩn"}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            />
          </PaginationItem>
          <PaginationItem>
            Trang {currentPage} / {totalPages}
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Dialog
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
      </Dialog>
    </div>
  );
}
