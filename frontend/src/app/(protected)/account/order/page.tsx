import { columns } from "@/components/features/order/colums";
import { OrderTable } from "@/components/features/order/order-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import React from "react";

export default function OrderPage() {
  return (
    <div>
      <h1 className="font-medium text-2xl mb-4">Đơn hàng</h1>
      <div className="flex">
        <div className="flex space-x-2 items-center rounded-md border-2 p-1 px-2 w-1/3">
          <SearchIcon />
          <input
            type="text"
            className="outline-none border-none flex-1"
            placeholder="Mã đơn hàng"
          />
        </div>
        <Select defaultValue="newest">
          <SelectTrigger className="ms-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="oldest">Cũ nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ul className="flex w-full items-center justify-center my-4">
        <li
          data-selected={true}
          className="py-2 px-6 cursor-pointer border-b-2 border-b-transparent hover:border-b-primary flex-1 text-center data-[selected=true]:bg-primary-light data-[selected=true]:border-b-primary"
        >
          Tất cả
        </li>
        <li className="py-2 px-6 cursor-pointer border-b-2 border-b-transparent hover:border-b-primary flex-1 text-center">
          Chờ xác nhận
        </li>
        <li className="py-2 px-6 cursor-pointer border-b-2 border-b-transparent hover:border-b-primary flex-1 text-center">
          Đang xử lí
        </li>
        <li className="py-2 px-6 cursor-pointer border-b-2 border-b-transparent hover:border-b-primary flex-1 text-center">
          Thành công
        </li>
        <li className="py-2 px-6 cursor-pointer border-b-2 border-b-transparent hover:border-b-primary flex-1 text-center">
          Thất bại
        </li>
      </ul>
      <OrderTable
        columns={columns}
        data={[
          {
            id: "37472",
            products: [],
            time: { start: "20/5/2025", end: "25/5/2025" },
            address: "Nhà",
            price: 210000,
            status: "pending",
          },
        ]}
      ></OrderTable>
    </div>
  );
}
