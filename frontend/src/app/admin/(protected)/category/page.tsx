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

export type Category = {
  id: number;
  name: string;
  level: number;
  children?: Category[];
};

const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Mạch tích hợp",
    level: 1,
    children: [
      {
        id: 11,
        name: "IC-Vi điều khiển",
        level: 2,
        children: [
          { id: 111, name: "Vi điều khiển", level: 3 },
          { id: 112, name: "Vi xử lí", level: 3 },
        ],
      },
      {
        id: 12,
        name: "IC Nguồn",
        level: 2,
        children: [
          { id: 121, name: "IC Ổn áp", level: 3 },
          { id: 122, name: "IC điều khiển cổng", level: 3 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Linh kiện điện tử thụ động",
    level: 1,
    children: [],
  },
  {
    id: 3,
    name: "Cảm biến",
    level: 1,
    children: [],
  },
];

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  const [openAddCat, setOpenAddCat] = useState(false);
  const [openAddAttr, setOpenAddAttr] = useState(false);
  const [currentParentId, setCurrentParentId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValues, setNewAttrValues] = useState("");

  const handleAddCategory = () => {
    if (currentParentId === null) return;
    const addRecursively = (nodes: Category[]): Category[] => {
      return nodes.map((cat) => {
        if (cat.id === currentParentId) {
          const newCat: Category = {
            id: Date.now(),
            name: newName,
            level: cat.level + 1,
          };
          return {
            ...cat,
            children: [...(cat.children || []), newCat],
          };
        }
        if (cat.children) {
          return { ...cat, children: addRecursively(cat.children) };
        }
        return cat;
      });
    };
    setCategories(addRecursively(categories));
    setNewName("");
    setOpenAddCat(false);
  };

  const handleAddAttribute = () => {
    console.log({
      attr: newAttrName,
      values: newAttrValues.split(",").map((v) => v.trim()),
    });
    setNewAttrName("");
    setNewAttrValues("");
    setOpenAddAttr(false);
  };

  const renderLevel = (nodes: Category[]) =>
    nodes.map((cat) => (
      <Collapsible key={cat.id} className="ml-4 border-l pl-4 space-y-2">
        <div className="flex items-center justify-between group hover:bg-background p-2 rounded-md">
          <CollapsibleTrigger className="text-left flex-1 font-medium">
            {cat.name}
          </CollapsibleTrigger>
          <div className="space-x-2">
            {cat.level < 3 ? (
              <Button
                className="group-hover:bg-white cursor-pointer hover:bg-white"
                size="sm"
                variant="outline"
                onClick={() => {
                  setCurrentParentId(cat.id);
                  setOpenAddCat(true);
                }}
              >
                + Danh mục
              </Button>
            ) : (
              <Button
                className="group-hover:bg-white cursor-pointer hover:bg-white"
                size="sm"
                variant="outline"
                onClick={() => {
                  setCurrentParentId(cat.id);
                  setOpenAddAttr(true);
                }}
              >
                + Thuộc tính
              </Button>
            )}
          </div>
        </div>

        <CollapsibleContent>
          {cat.children && renderLevel(cat.children)}
        </CollapsibleContent>
      </Collapsible>
    ));

  return (
    <div className="space-y-4">
      {renderLevel(categories)}

      {/* Modal thêm danh mục */}
      <Dialog open={openAddCat} onOpenChange={setOpenAddCat}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm danh mục</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Tên danh mục</Label>
            <input
              className="p-2 border w-full"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddCategory}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button onClick={handleAddAttribute}>Thêm thuộc tính</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
