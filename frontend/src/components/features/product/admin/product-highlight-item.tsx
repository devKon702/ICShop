import ClampText from "@/components/common/clamp-text";
import SafeImage from "@/components/common/safe-image";
import Separator from "@/components/common/separator";
import { HIGHLIGHT_OPTIONS } from "@/constants/enum-options";
import { HighlightType } from "@/constants/enums";
import env from "@/constants/env";
import highlightService from "@/libs/services/highlight.service";
import { useModalActions } from "@/store/modal-store";
import { formatPrice } from "@/utils/price";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Info, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
  highlight: {
    id: number;
    type: HighlightType;
  };
  product: {
    id: number;
    name: string;
    posterUrl: string;
    price: number;
    categoryName: string;
    isActive: boolean;
  };
}

export default function ProductHighlightItem({ product, highlight }: Props) {
  const { openModal } = useModalActions();
  const queryClient = useQueryClient();
  const { mutate: deleteHighlightMutate } = useMutation({
    mutationFn: () => highlightService.admin.remove(highlight.id),
    onSuccess: () => {
      toast.success("Xóa thành công sản phẩm nổi bật");
      queryClient.invalidateQueries({ queryKey: ["products", "highlights"] });
    },
    onError: () => {
      toast.error("Lỗi xảy ra khi xóa sản phẩm nổi bật");
    },
  });
  return (
    <div
      data-active={product.isActive}
      className="w-full h-full rounded-md p-2 border shadow bg-white flex flex-col data-[active=false]:opacity-50"
    >
      <SafeImage
        key={env.NEXT_PUBLIC_FILE_URL + "/" + product.posterUrl}
        src={env.NEXT_PUBLIC_FILE_URL + "/" + product.posterUrl}
        width={200}
        height={200}
        alt={product.name}
        className="aspect-square w-full shadow mb-2 border rounded-md"
      />
      <ClampText
        text={product.name}
        lines={2}
        className="font-semibold mb-4 text-sm"
      />
      <Separator className="mt-auto" />
      <div className="flex justify-between items-center mt-2">
        <p>{formatPrice(product.price)} vnđ</p>
        <div className="flex">
          <div
            className="p-1 rounded-md hover:bg-red-600/10 text-red-500 cursor-pointer"
            onClick={() => {
              if (
                confirm(
                  "Xác nhận xóa sản phẩm khỏi " +
                    HIGHLIGHT_OPTIONS.find(
                      (option) => option.value === highlight.type
                    )?.label +
                    "?"
                )
              ) {
                deleteHighlightMutate();
              }
            }}
          >
            <Trash />
          </div>
          <div
            className="p-1 rounded-md hover:bg-gray-600/10 cursor-pointer"
            onClick={() =>
              openModal({
                type: "productDetail",
                props: { productId: product.id },
              })
            }
          >
            <Info />
          </div>
        </div>
      </div>
    </div>
  );
}
