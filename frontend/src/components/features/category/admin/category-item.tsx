"use client";
import ClampText from "@/components/common/clamp-text";
import Separator from "@/components/common/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryBaseSchema } from "@/libs/schemas/category.schema";
import attributeValueService from "@/libs/services/attribute-value.service";
import attributeService from "@/libs/services/attribute.service";
import categoryService from "@/libs/services/category.service";
import { useModalActions } from "@/store/modal-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash, X } from "lucide-react";
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
    onSuccess: ({ data }) => {
      toast.success("Cập nhật danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
      if (data.level === 3) {
        queryClient.invalidateQueries({
          queryKey: ["categories", { level: 3 }],
        });
      }
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
      if (category.level === 3) {
        queryClient.invalidateQueries({
          queryKey: ["categories", { level: 3 }],
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: addAttributeMutate } = useMutation({
    mutationFn: (name: string) => attributeService.create(category.id, name),
    onSuccess: () => {
      toast.success("Thêm thuộc tính thành công");
      queryClient.invalidateQueries({
        queryKey: ["attributes", { categoryId: category.id }],
      });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteAttributeMutate } = useMutation({
    mutationFn: (id: number) => attributeService.delete(id),
    onSuccess: () => {
      toast.success("Xóa thuộc tính thành công");
      queryClient.invalidateQueries({
        queryKey: ["attributes", { categoryId: category.id }],
      });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: editAttributeMutate } = useMutation({
    mutationFn: (data: { id: number; name: string }) =>
      attributeService.update(data.id, data.name),
    onSuccess: () => {
      toast.success("Cập nhật thuộc tính thành công");
      queryClient.invalidateQueries({
        queryKey: ["attributes", { categoryId: category.id }],
      });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: addValueMutate } = useMutation({
    mutationFn: (data: { attributeId: number; value: string }) =>
      attributeValueService.create(data.attributeId, data.value),
    onSuccess: () => {
      toast.success("Thêm giá trị thành công");
      queryClient.invalidateQueries({
        queryKey: ["attributes", { categoryId: category.id }],
      });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: deleteValueMutate } = useMutation({
    mutationFn: (id: number) => attributeValueService.delete(id),
    onSuccess: () => {
      toast.success("Xóa giá trị thành công");
      queryClient.invalidateQueries({
        queryKey: ["attributes", { categoryId: category.id }],
      });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="border rounded-md">
      {/* Category */}
      <div
        className={`flex p-2 items-center hover:bg-primary-light cursor-pointer ${
          isSelected ? "bg-primary-light font-semibold" : ""
        }`}
        onClick={() => onClick()}
      >
        <ClampText lines={2} text={category.name} className="flex-1" />
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
      {/* Attribute list */}
      {category.level == 3 && isSelected && (
        <div className="mt-2 space-y-2 p-2">
          <Separator />
          <p className="font-semibold">Thông số</p>
          {isLoading && <Skeleton className="w-full rounded-md h-10" />}
          {data?.data.map((attr) => (
            <div key={attr.id} className="">
              <div className="rounded-md flex items-center">
                <ClampText
                  lines={2}
                  showTitle={true}
                  text={attr.name}
                  className="font-medium opacity-50"
                />
                <Pencil
                  className="ml-auto p-1 hover:bg-primary/10 cursor-pointer rounded-md"
                  onClick={() => {
                    openModal({
                      type: "prompt",
                      props: {
                        title: "Sửa thông số",
                        defaultValue: attr.name,
                        maxLength: 50,
                        onSubmit: (value) =>
                          editAttributeMutate({ id: attr.id, name: value }),
                      },
                    });
                  }}
                />
                <Trash
                  className="ml-2 p-1 hover:bg-red-100 text-red-400 cursor-pointer rounded-md"
                  onClick={() => {
                    if (confirm("Xác nhận xóa thông số " + attr.name)) {
                      deleteAttributeMutate(attr.id);
                    }
                  }}
                />
              </div>
              <div className="flex space-x-2 space-y-1 flex-wrap mt-1">
                {attr.values.map((val) => (
                  <div
                    key={val.id}
                    className="border px-2 py-1 rounded-md flex items-center space-x-1"
                  >
                    <span>{val.value}</span>
                    <X
                      className="ml-auto p-1 hover:bg-red-100 text-red-400 cursor-pointer rounded-md"
                      onClick={() => {
                        if (
                          confirm(
                            `Xác nhận xóa giá trị ${attr.name}: ${val.value}`
                          )
                        ) {
                          deleteValueMutate(val.id);
                        }
                      }}
                    />
                  </div>
                ))}

                <div
                  className="px-2 py-1 flex items-center rounded-md space-x-1 cursor-pointer text-primary bg-primary/10 h-fit"
                  onClick={() => {
                    openModal({
                      type: "prompt",
                      props: {
                        title: `Thêm giá trị cho ${attr.name}`,
                        placeholder: "Giá trị",
                        maxLength: 50,
                        onSubmit: (value) => {
                          addValueMutate({ attributeId: attr.id, value });
                        },
                      },
                    });
                  }}
                >
                  <Plus className="p-1" />
                  <span>Giá trị</span>
                </div>
              </div>
            </div>
          ))}
          <div
            className="text-semibold flex items-center rounded-md px-2 py-1 cursor-pointer text-primary bg-primary/10"
            onClick={() => {
              openModal({
                type: "prompt",
                props: {
                  title: "Thêm thông số cho " + category.name,
                  placeholder: "Tên thông số",
                  maxLength: 50,
                  onSubmit: (value) => {
                    addAttributeMutate(value);
                  },
                },
              });
            }}
          >
            <Plus /> <span>Thêm thông số</span>
          </div>
        </div>
      )}
    </div>
  );
}
