"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import categoryService from "@/libs/services/category.service";
import { toast } from "sonner";
import { z } from "zod";
import { CategoryBaseSchema } from "@/libs/schemas/category.schema";
import { Skeleton } from "@/components/ui/skeleton";
import CategorySection from "@/components/features/category/admin/category-section";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CategoryWithChildrenSchema = CategoryBaseSchema.extend({
  children: z.array(CategoryBaseSchema).optional(),
});

export default function AdminCategoryPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categoryTree"],
    queryFn: categoryService.getAllCategory4Admin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const [selectedlv1Id, setSelectedlv1Id] = React.useState<number | null>(null);
  const [selectedlv2Id, setSelectedlv2Id] = React.useState<number | null>(null);
  const [selectedlv3Id, setSelectedlv3Id] = React.useState<number | null>(null);
  // Reset level 3 when level 2 changes

  if (isLoading)
    return (
      <div className="space-y-2">
        <Skeleton className="w-full h-10 shadow" />
        <Skeleton className="w-full h-10 shadow" />
        <Skeleton className="w-full h-10 shadow" />
      </div>
    );
  if (isError) {
    toast.error(error.message);
    return null;
  }

  // const render = (cat: z.infer<typeof AdminCategorySchema>) => (
  //   <Collapsible key={cat.id} className="border-l-2 pl-4 space-y-2">
  //     <div className="flex items-center justify-between group hover:bg-background p-2 rounded-md">
  //       <CollapsibleTrigger className="text-left flex-1 font-medium cursor-pointer">
  //         {cat.name} {cat.children ? `(${cat.children.length})` : null}
  //       </CollapsibleTrigger>
  //       <div className="space-x-2">
  //         {cat.level < 3 ? (
  //           <Button
  //             className="group-hover:bg-white cursor-pointer hover:bg-white"
  //             size="sm"
  //             variant="outline"
  //             onClick={() => {
  //               openModal({
  //                 type: "createCategory",
  //                 props: {
  //                   parentId: cat.id,
  //                   onSuccess: () => {
  //                     refetch();
  //                     closeModal();
  //                   },
  //                 },
  //               });
  //             }}
  //           >
  //             <Plus /> Danh mục
  //           </Button>
  //         ) : (
  //           <Button
  //             className="group-hover:bg-white cursor-pointer hover:bg-white"
  //             size="sm"
  //             variant="outline"
  //             onClick={() => {
  //               openModal({
  //                 type: "createAttribute",
  //                 props: {
  //                   categoryId: cat.id,
  //                   onSuccess: () => {
  //                     // cat.attributes?.push({ ...res, values: [] });
  //                     refetch();
  //                     closeModal();
  //                   },
  //                 },
  //               });
  //             }}
  //           >
  //             <Plus /> Thuộc tính
  //           </Button>
  //         )}
  //         <Button
  //           className="bg-red-400 text-white hover:bg-red-500 cursor-pointer"
  //           onClick={() => {
  //             if (confirm("Xác nhận xóa danh mục " + cat.name)) {
  //               categoryService
  //                 .delete(cat.id)
  //                 .then(() => {
  //                   refetch();
  //                 })
  //                 .catch(() => {
  //                   toast.error("Không thể xóa danh mục này");
  //                 });
  //             }
  //           }}
  //         >
  //           <Trash />
  //           Xóa
  //         </Button>
  //       </div>
  //     </div>

  //     <CollapsibleContent>
  //       {cat.children && cat.children.map((child) => render(child))}
  //       {cat.attributes &&
  //         cat.attributes.map(
  //           (attr) => attr && <AttributeItem key={attr.id} attribute={attr} />
  //         )}
  //     </CollapsibleContent>
  //   </Collapsible>
  // );

  // return (
  //   <div className="space-y-4">
  //     {data?.data.map((cat) => render(cat))}
  //     <button
  //       className="w-full space-x-2 border-2 border-dashed rounded-lg py-2 flex items-center justify-center cursor-pointer"
  //       onClick={() =>
  //         openModal({
  //           type: "createCategory",
  //           props: {
  //             onSuccess: () => {
  //               refetch();
  //               closeModal();
  //             },
  //           },
  //         })
  //       }
  //     >
  //       <Plus /> <span>Thêm danh mục</span>
  //     </button>
  //   </div>
  // );
  return (
    <div className="grid grid-cols-3 gap-4">
      <CategorySection
        title="Level 1"
        categories={data?.data || []}
        onToggle={(category, isSelected) => {
          setSelectedlv1Id(isSelected ? null : category.id);
          setSelectedlv2Id(null);
          setSelectedlv3Id(null);
        }}
        selectedId={selectedlv1Id}
      ></CategorySection>
      <CategorySection
        title="Level 2"
        categories={
          data?.data.find((c) => c.id === selectedlv1Id)?.children || []
        }
        onToggle={(category, isSelected) => {
          setSelectedlv2Id(isSelected ? null : category.id);
        }}
        selectedId={selectedlv2Id}
        parentId={selectedlv1Id || undefined}
      ></CategorySection>
      <CategorySection
        title="Level 3"
        categories={
          data?.data
            .find((c) => c.id === selectedlv1Id)
            ?.children.find((c) => c.id === selectedlv2Id)?.children || []
        }
        onToggle={(category, isSelected) => {
          setSelectedlv3Id(isSelected ? null : category.id);
        }}
        selectedId={selectedlv3Id}
        parentId={selectedlv2Id || undefined}
      ></CategorySection>
    </div>
  );
}
