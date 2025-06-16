import React from "react";

export default function CartHeader() {
  return (
    <div className="p-2 flex items-center space-x-5 border-b-2">
      <div className="size-5 border rounded-full cursor-pointer bg-white border-primary data-[checked=true]:bg-primary shrink-0"></div>
      <span>Tất cả</span>
      <div className="ms-auto w-fit space-x-1">
        <span className="font-medium text-lg">2/3</span>
        <span className="font-medium opacity-50">sản phẩm</span>
      </div>
    </div>
  );
}
