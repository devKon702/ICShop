import AppSelector from "@/components/common/app-selector";
import { Button } from "@/components/ui/button";
import { HIGHLIGHT_OPTIONS } from "@/constants/enum-options";
import { HighlightType } from "@/constants/enums";
import highlightService from "@/libs/services/highlight.service";
import { useModalActions } from "@/store/modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
  productId: number;
}

export default function AddToHighlight({ productId }: Props) {
  const { closeModal } = useModalActions();
  const [selectedHighlight, setSelectedHighlight] =
    React.useState<HighlightType>(HighlightType.BEST_SELL);
  const queryClient = useQueryClient();
  const { mutate: addToHighlightMutate } = useMutation({
    mutationFn: (highlightType: HighlightType) =>
      highlightService.admin.add(productId, highlightType),
    onSuccess: () => {
      toast.success("Thêm vào mục nổi bật thành công");
      queryClient.invalidateQueries({ queryKey: ["highlights"] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err.message || "Thêm vào mục nổi bật thất bại");
    },
  });
  return (
    <div className="space-y-4 p-2">
      <AppSelector
        data={HIGHLIGHT_OPTIONS.map((item) => ({
          label: item.label,
          value: item.value,
        }))}
        onValueChange={(value) => setSelectedHighlight(value as HighlightType)}
        className="w-full"
        defaultValue={HighlightType.BEST_SELL}
      />
      <Button
        onClick={() => {
          if (
            selectedHighlight &&
            confirm(
              `Xác nhận thêm sản phẩm vào mục ${
                HIGHLIGHT_OPTIONS.find(
                  (item) => item.value === selectedHighlight
                )?.label
              }?`
            )
          ) {
            addToHighlightMutate(selectedHighlight);
          }
        }}
        className="flex ml-auto"
      >
        <Plus /> Thêm
      </Button>
    </div>
  );
}
