import { Skeleton } from "@/components/ui/skeleton";
import { Trash } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="grid grid-cols-12 space-x-4">
      <div className="rounded-md col-span-3 space-y-4 bg-white shadow-xl h-40 flex flex-col overflow-hidden">
        <div className="bg-primary text-white p-2 flex justify-start items-center space-x-2 font-bold">
          <i className="bx bxs-filter-alt"></i>
          <span>Lọc sản phẩm</span>
        </div>
        <Skeleton className="h-full rounded-md m-2" />
      </div>
      <div className="col-span-9 space-y-4">
        <div className="bg-white rounded-md w-full h-fit flex items-center p-2">
          <div className="flex space-x-2 ms-auto w-fit">
            <button
              className="rounded-sm bg-primary text-white cursor-pointer px-3 disabled:opacity-50 disabled:pointer-events-none py-1 flex justify-between items-center"
              disabled={true}
            >
              <i className="bx bxs-filter-alt me-2"></i>
              Lọc
            </button>
            <button
              className="border border-red-500 py-1 px-3 rounded-sm disabled:opacity-50 disabled:pointer-events-none text-red-500 flex items-center space-x-2 cursor-pointer"
              disabled={true}
            >
              <Trash className="p-1" />
              <span>Xóa tất cả</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 h-60 bg-white p-2 rounded-md shadow">
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
        </div>
      </div>
    </div>
  );
}
