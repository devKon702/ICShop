import AppSelector from "@/components/common/app-selector";
import { Button } from "@/components/ui/button";
import collectionService from "@/libs/services/collection.service";
import { useModalActions } from "@/store/modal-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

interface Props {
  productId: number;
}

export default function AddToCollection({ productId }: Props) {
  const [selectedCollectionId, setSelectedCollectionId] = React.useState<
    number | null
  >(null);
  const { closeModal } = useModalActions();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["collections"],
    queryFn: collectionService.admin.getAll,
  });
  const { mutate: addToCollectionMutate } = useMutation({
    mutationFn: (collectionId: number) =>
      collectionService.admin.addProduct({ productId, collectionId }),
    onSuccess: () => {
      toast.success("Thêm sản phẩm vào bộ sưu tập thành công.");
      queryClient.invalidateQueries({ queryKey: ["collections", "products"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "Thêm sản phẩm vào bộ sưu tập thất bại. Vui lòng thử lại."
      );
    },
  });
  return (
    <div className="w-[50dvww] p-2 space-y-4">
      <p className="font-semibold mb-2">Bộ sưu tập</p>
      <AppSelector
        data={
          [
            ...(data?.data.map((collection) => ({
              label: collection.name,
              value: collection.id,
            })) ?? []),
          ] as const
        }
        onValueChange={(value) => {
          setSelectedCollectionId(value);
        }}
        className="w-full"
      />
      <Button
        onClick={() =>
          selectedCollectionId !== null &&
          addToCollectionMutate(selectedCollectionId)
        }
        className="flex ml-auto"
        disabled={selectedCollectionId === null}
      >
        Thêm
      </Button>
    </div>
  );
}
