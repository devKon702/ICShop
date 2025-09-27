"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryBaseSchema } from "@/libs/schemas/category.schema";
import attributeService from "@/libs/services/attribute.service";
import categoryService from "@/libs/services/category.service";
import { useModalActions } from "@/store/modal-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CategoryWithChildrenSchema = CategoryBaseSchema.extend({
  children: z.array(CategoryBaseSchema).optional(),
});

interface CategoryAttributeItemProps {
  category: z.infer<typeof CategoryWithChildrenSchema>;
  onClick: () => void;
  isSelected: boolean;
}

export default function CategoryItem({
  category,
  isSelected,
  onClick,
}: CategoryAttributeItemProps) {
  const { openModal, closeModal } = useModalActions();
  const { data, isLoading } = useQuery({
    queryKey: ["attributes", { categoryId: category.id }],
    queryFn: () => attributeService.getByCategoryId(category.id),
    enabled: category.level === 3 && isSelected,
  });
  const queryClient = useQueryClient();

  const { mutate: updateCategoryMutate } = useMutation({
    mutationFn: (name: string) => categoryService.update(category.id, name),
    onSuccess: () => {
      toast.success("Cập nhật danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteCategoryMutate } = useMutation({
    mutationFn: (id: number) => categoryService.delete(id),
    onSuccess: () => {
      toast.success("Xóa danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="border">
      <div
        className={`flex p-2 items-center hover:bg-primary-light cursor-pointer ${
          isSelected ? "bg-primary-light font-semibold" : ""
        }`}
        onClick={() => onClick()}
      >
        <p>{category.name}</p>
        <Pencil
          className="text-gray-500  ml-auto rounded-md p-1 hover:bg-primary/10"
          strokeWidth={2}
          onClick={(e) => {
            e.stopPropagation();
            openModal({
              type: "prompt",
              props: {
                title: "Sửa danh mục",
                placeholder: "Tên danh mục",
                defaultValue: category.name,
                onSubmit: (value) => {
                  updateCategoryMutate(value);
                },
              },
            });
          }}
        />
        <Trash
          className="text-red-400  rounded-md ml-2 p-1 hover:bg-red-100"
          strokeWidth={2}
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Xác nhận xóa danh mục " + category.name)) {
              deleteCategoryMutate(category.id);
            }
          }}
        />
      </div>
      {/* Show attributes */}
      {category.level == 3 && isSelected && (
        <div className="mt-2 space-y-2">
          {isLoading && <Skeleton className="w-full rounded-md h-10" />}
          {data?.data.map((attr) => (
            <div key={attr.id} className="border p-2 rounded-md">
              <p className="font-medium">{attr.name}</p>
            </div>
          ))}
          {data?.data.length === 0 && <p>Chưa có dữ liệu nào</p>}
        </div>
      )}
    </div>
  );
}
