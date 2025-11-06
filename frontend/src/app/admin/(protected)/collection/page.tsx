"use client";
import ClampText from "@/components/common/clamp-text";
import SafeImage from "@/components/common/safe-image";
import UpdateCollectionForm from "@/components/features/collection/update-collection-form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import env from "@/constants/env";
import collectionService from "@/libs/services/collection.service";
import { useModalActions } from "@/store/modal-store";
import { formatPrice } from "@/utils/price";
import { containsIgnoreCaseAndAccents } from "@/utils/string";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeClosed, Info, Plus, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function CollectionPage() {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [search, setSearch] = React.useState("");

  const { openModal } = useModalActions();

  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["collections", "products"],
    queryFn: collectionService.admin.getAllWithProducts,
  });

  const { mutate: removeProductMutate } = useMutation({
    mutationFn: (productCollectionId: number) =>
      collectionService.admin.removeProduct(productCollectionId),
    onSuccess: () => {
      toast.success("Xóa sản phẩm khỏi bộ sưu tập thành công.");
      queryClient.invalidateQueries({ queryKey: ["collections", "products"] });
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "Xóa sản phẩm khỏi bộ sưu tập thất bại. Vui lòng thử lại."
      );
    },
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 grid grid-cols-12 gap-2 overflow-auto app">
      <section className="col-span-4 rounded-md border px-4 py-2 shadow space-y-2 flex flex-col overflow-y-auto app">
        <div className="flex items-center justify-between">
          <p className="font-semibold py-4">Bộ sưu tập</p>
          <Button
            title="Thêm bộ sưu tập"
            onClick={() => openModal({ type: "createCollection", props: {} })}
          >
            <Plus />
          </Button>
        </div>
        <input
          placeholder="Tìm kiếm bộ sưu tập"
          className="p-2 border rounded-md w-full font-semibold outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {data.data
          .filter((item) => containsIgnoreCaseAndAccents(item.name, search))
          .map((collection) => (
            <div
              key={collection.id}
              data-active={collection.isActive}
              data-selected={selectedId === collection.id}
              className="shadow p-2 rounded-md bg-primary/5 hover:bg-primary/10 cursor-pointer space-y-1 data-[selected=true]:bg-primary data-[selected=true]:text-white"
              onClick={() =>
                setSelectedId(
                  selectedId === collection.id ? null : collection.id
                )
              }
            >
              <ClampText
                lines={1}
                text={collection.name}
                className="font-semibold"
              />
              <ClampText
                lines={2}
                text={collection.desc}
                className="text-sm font-semibold opacity-80"
              />
              <div className="flex justify-between">
                <div className="font-semibold text-sm space-x-1 flex items-center">
                  {collection.isActive ? (
                    <Eye className="p-1" />
                  ) : (
                    <EyeClosed className="p-1" />
                  )}
                  {collection.isActive ? (
                    <span>Hoạt động</span>
                  ) : (
                    <span>Ẩn</span>
                  )}
                </div>

                <span className="font-semibold text-sm">
                  {collection.productCollections.length} sản phẩm
                </span>
              </div>
            </div>
          ))}
        {data.data.length === 0 && (
          <p className="text-center py-4">Chưa có bộ sưu tập nào.</p>
        )}
      </section>
      <section className="col-span-8 rounded-md border shadow p-4 flex-1 overflow-y-auto app">
        {(() => {
          const collection = data.data.find((item) => item.id === selectedId);
          if (!collection) {
            return (
              <div className="flex items-center justify-center h-full text-center text-sm opacity-50">
                Chọn một bộ sưu tập để xem chi tiết.
              </div>
            );
          }
          return (
            <div>
              <UpdateCollectionForm
                key={JSON.stringify(collection)}
                collection={collection}
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collection.productCollections.map((item) => (
                    <TableRow
                      key={item.id}
                      className="p-2 rounded-md hover:bg-primary/10 cursor-pointer data-[active=false]:opacity-50"
                      data-active={item.product.isActive}
                    >
                      <TableCell className="flex items-center space-x-2">
                        <SafeImage
                          key={
                            env.NEXT_PUBLIC_FILE_URL +
                            "/" +
                            item.product.posterUrl
                          }
                          src={
                            env.NEXT_PUBLIC_FILE_URL +
                            "/" +
                            item.product.posterUrl
                          }
                          alt={item.product.name}
                          width={50}
                          height={50}
                          className="rounded-md border"
                        />
                        <ClampText lines={1} text={item.product.name} />
                      </TableCell>
                      <TableCell>
                        <ClampText
                          lines={1}
                          text={item.product.category.name}
                        />
                      </TableCell>
                      <TableCell>
                        {formatPrice(Number(item.product.price))} đ
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-2">
                          <div
                            className="cursor-pointer p-1 hover:bg-gray-600/10 rounded-md"
                            onClick={() => {
                              openModal({
                                type: "productDetail",
                                props: { productId: item.product.id },
                              });
                            }}
                            title="Chi tiết sản phẩm"
                          >
                            <Info className="cursor-pointer p-1" />
                          </div>
                          <div
                            className="cursor-pointer p-1 hover:bg-red-600/10 rounded-md"
                            onClick={() => {
                              if (confirm("Xác nhận xóa khỏi bộ sưu tập")) {
                                removeProductMutate(item.id);
                              }
                            }}
                            title="Xóa khỏi bộ sưu tập"
                          >
                            <Trash className="cursor-pointer p-1 text-red-600" />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        })()}
      </section>
    </div>
  );
}
