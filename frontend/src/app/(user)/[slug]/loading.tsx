import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function loading() {
  return (
    <>
      <Skeleton className="h-8 w-1/4 mb-2" />
      <div className="grid grid-cols-12 w-full space-x-2">
        <Skeleton className="col-span-4 h-96 rounded-md bg-white" />
        <div className="col-span-8 p-2 rounded-md bg-white space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/3" />

          <div className="flex justify-between w-full space-x-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
          <div className="w-full h-12 mt-4">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
      <div className="rounded-md bg-white p-2 mt-2 pb-6">
        <Skeleton className="h-8 w-1/4 mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-2/5 mb-2" />
      </div>
    </>
  );
}
