"use client";

import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useModalActions } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import categoryService from "@/libs/services/category.service";
import { toast } from "sonner";
import { z } from "zod";
import { AdminCategorySchema } from "@/libs/schemas/category.schema";
import { Pencil, Plus, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCategoryPage() {
  const [openAddAttr, setOpenAddAttr] = useState(false);
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValues, setNewAttrValues] = useState("");

  const { openModal, closeModal } = useModalActions();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["categoryTree"],
    queryFn: categoryService.getAllCategory4Admin,
  });

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

  const render = (cat: z.infer<typeof AdminCategorySchema>) => (
    <Collapsible key={cat.id} className="border-l-2 pl-4 space-y-2">
      <div className="flex items-center justify-between group hover:bg-background p-2 rounded-md">
        <CollapsibleTrigger className="text-left flex-1 font-medium cursor-pointer">
          {cat.name} {cat.children ? `(${cat.children.length})` : null}
        </CollapsibleTrigger>
        <div className="space-x-2">
          {cat.level < 3 ? (
            <Button
              className="group-hover:bg-white cursor-pointer hover:bg-white"
              size="sm"
              variant="outline"
              onClick={() => {
                openModal({
                  type: "createCategory",
                  props: {
                    parentId: cat.id,
                    onSuccess: () => {
                      refetch();
                      closeModal();
                    },
                  },
                });
              }}
            >
              <Plus /> Danh mục
            </Button>
          ) : (
            <Button
              className="group-hover:bg-white cursor-pointer hover:bg-white"
              size="sm"
              variant="outline"
              onClick={() => {
                openModal({
                  type: "createAttribute",
                  props: {
                    categoryId: cat.id,
                    onSuccess: () => {
                      // cat.attributes?.push({ ...res, values: [] });
                      refetch();
                      closeModal();
                    },
                  },
                });
              }}
            >
              <Plus /> Thuộc tính
            </Button>
          )}
          <Button
            className="bg-red-400 text-white hover:bg-red-500 cursor-pointer"
            onClick={() => {
              if (confirm("Xác nhận xóa danh mục " + cat.name)) {
                categoryService
                  .delete(cat.id)
                  .then(() => {
                    refetch();
                  })
                  .catch(() => {
                    toast.error("Không thể xóa danh mục này");
                  });
              }
            }}
          >
            <Trash />
            Xóa
          </Button>
        </div>
      </div>

      <CollapsibleContent>
        {cat.children && cat.children.map((child) => render(child))}
        {cat.attributes &&
          cat.attributes.map(
            (attr) =>
              attr && (
                <div className="pl-4 border-l-2" key={attr.id}>
                  <div className="flex items-center p-2 hover:bg-background rounded-lg">
                    <div className="flex flex-1 flex-wrap justify-start items-center space-x-2 space-y-2">
                      <span className="font-semibold mr-3">{attr.name}:</span>
                      {attr.values.map((item) => (
                        <Popover key={item.id}>
                          <PopoverTrigger className="px-2 py-1 bg-primary-light rounded-lg mr-1 cursor-pointer flex space-x-4  items-center">
                            {item.value}
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-fit space-y-2 p-2"
                            side="right"
                          >
                            <div className="font-semibold flex items-center space-x-2 hover:bg-primary hover:text-white px-4 py-1 rounded-lg cursor-pointer">
                              <Pencil className="size-4" />
                              <span>Sửa</span>
                            </div>
                            <div className="font-semibold flex items-center space-x-2 hover:bg-red-400 hover:text-white px-4  py-1 rounded-lg cursor-pointer">
                              <Trash className="size-4" />
                              <span>Xóa</span>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ))}
                    </div>
                    <div className="space-x-2 flex flex-nowrap">
                      <Button
                        className="cursor-pointer"
                        onClick={() => {
                          openModal({
                            type: "createValue",
                            props: {
                              attributeId: attr.id,
                              onSuccess: () => {
                                closeModal();
                                refetch();
                              },
                            },
                          });
                        }}
                      >
                        <Plus />
                        Giá trị
                      </Button>
                      <Button className="bg-red-400 text-white hover:bg-red-500 cursor-pointer">
                        <Trash />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              )
          )}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="space-y-4">
      {data?.data.map((cat) => render(cat))}
      <button
        className="w-full space-x-2 border-2 border-dashed rounded-lg py-2 flex items-center justify-center cursor-pointer"
        onClick={() =>
          openModal({
            type: "createCategory",
            props: {
              onSuccess: () => {
                refetch();
                closeModal();
              },
            },
          })
        }
      >
        <Plus /> <span>Thêm danh mục</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Modal thêm thuộc tính */}
      <Dialog open={openAddAttr} onOpenChange={setOpenAddAttr}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm thuộc tính</DialogTitle>
            <DialogDescription>
              Nhập tên thuộc tính và các giá trị cách nhau bằng dấu phẩy
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Tên thuộc tính</Label>
            <input
              className="p-2 border w-full"
              value={newAttrName}
              onChange={(e) => setNewAttrName(e.target.value)}
            />
            <Label>Giá trị (vd: Đỏ, Xanh)</Label>
            <input
              className="p-2 border w-full"
              value={newAttrValues}
              onChange={(e) => setNewAttrValues(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button>Thêm thuộc tính</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
