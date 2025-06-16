"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InfoIcon } from "lucide-react";
import { ReactNode } from "react";

export type Order = {
  id: string;
  products: string[];
  time: { start: string; end: string };
  address: string;
  price: number;
  status: "pending" | "processing" | "success" | "failed";
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Mã",
  },
  {
    accessorKey: "products",
    header: "Sản phẩm",
  },
  {
    accessorKey: "time",
    header: "Thời gian",
    cell: ({ row }) => {
      const time = row.getValue("time") as { start: string; end: string };
      return (
        <div>
          <p>{time.start}</p>
          <p>{time.end}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Nơi nhận",
  },
  {
    accessorKey: "price",
    header: "Tổng tiền",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const format: {
        success: ReactNode;
        fail: ReactNode;
        pending: ReactNode;
        processing: ReactNode;
      } = {
        success: (
          <div className="py-1 px-2 rounded-md bg-primary-light text-primary w-fit font-medium">
            Hoàn thành
          </div>
        ),
        fail: (
          <div className="py-1 px-2 rounded-md bg-red-100 text-red-600 w-fit font-medium">
            Thất bại
          </div>
        ),
        pending: (
          <div className="py-1 px-2 rounded-md bg-yellow-50 text-yellow-600 w-fit font-medium">
            Chờ xác nhận
          </div>
        ),
        processing: (
          <div className="py-1 px-2 rounded-md bg-blue-100 text-blue-600 w-fit font-medium">
            Đang xử lí
          </div>
        ),
      };

      return (
        <p>
          {
            format[
              row.getValue("status") as
                | "success"
                | "fail"
                | "pending"
                | "processing"
            ]
          }
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div className="flex space-x-4 items-center justify-center">
          <div className="bg-red-100 text-red-600 cursor-pointer p-2 rounded-md font-medium">
            Huỷ đơn
          </div>
          <InfoIcon className="cursor-pointer"></InfoIcon>
        </div>
      );
    },
  },
];
