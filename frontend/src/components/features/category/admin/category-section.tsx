import CategoryItem from "@/components/features/category/admin/category-item";
import { Button } from "@/components/ui/button";
import { CategoryBaseSchema } from "@/libs/schemas/category.schema";
import categoryService from "@/libs/services/category.service";
import { useModalActions } from "@/store/modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layers, Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const categorySchema = CategoryBaseSchema.extend({
  children: z.array(CategoryBaseSchema).optional(),
});
type Category = z.infer<typeof categorySchema>;

interface CategorySectionProps {
  title: string;
  categories: z.infer<typeof categorySchema>[];
  parentId?: number;
  selectedId: number | null;
  onToggle: (category: Category, isSelected: boolean) => void;
}

export default function CategorySection({
  title,
  categories,
  selectedId,
  onToggle,
  parentId,
}: CategorySectionProps) {
  const { openModal, closeModal } = useModalActions();
  const queryClient = useQueryClient();
  const { mutate: createCategoryMutate } = useMutation({
    mutationFn: (name: string) => categoryService.create(name, parentId),
    onSuccess: () => {
      toast.success("Tạo danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <section className="border rounded-md h-fit">
      <div className="flex items-center border-b p-2">
        <Layers className="" />
        <h2 className="text-lg font-medium ml-2">{title}</h2>
        <Button
          className="ml-auto"
          onClick={() => {
            openModal({
              type: "prompt",
              props: {
                title: "Thêm danh mục",
                placeholder: "Tên danh mục",
                onSubmit: (value) => {
                  createCategoryMutate(value);
                },
              },
            });
          }}
        >
          <Plus />
        </Button>
      </div>
      <div>
        {categories.map((cat) => (
          <CategoryItem
            key={cat.id}
            category={cat}
            isSelected={selectedId === cat.id}
            onClick={() => onToggle(cat, selectedId === cat.id)}
          ></CategoryItem>
        ))}
      </div>
    </section>
  );
}
