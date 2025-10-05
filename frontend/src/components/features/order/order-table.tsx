"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleX, Info, QrCode } from "lucide-react";
import { OrderStatus } from "@/constants/enums";
import ClampText from "@/components/common/clamp-text";
import { useModalActions } from "@/store/modal-store";
import { formatPrice } from "@/utils/price";
import AppPagination from "@/components/common/app-pagination";
import { parseAsInteger, useQueryState } from "nuqs";

interface OrderTableProps {
  orders: {
    id: number;
    code: string;
    createdAt: string;
    receiverAddress: string;
    receiverName: string;
    receiverPhone: string;
    total: number;
    status: OrderStatus;
  }[];
  totalPage: number;
}

const statusColor = {
  [OrderStatus.CANCELED]: {
    className: "bg-red-100 text-red-800",
    label: "Đã hủy",
  },
  [OrderStatus.PENDING]: {
    className: "bg-yellow-100 text-yellow-800",
    label: "Chờ xác nhận",
  },
  [OrderStatus.PAID]: {
    className: "bg-blue-100 text-blue-800",
    label: "Đã thanh toán",
  },
  [OrderStatus.PROCESSING]: {
    className: "bg-purple-100 text-purple-800",
    label: "Đang xử lí",
  },
  [OrderStatus.SHIPPING]: {
    className: "bg-indigo-100 text-indigo-800",
    label: "Đang giao",
  },
  [OrderStatus.DONE]: {
    className: "bg-green-100 text-green-800",
    label: "Hoàn thành",
  },
} as const;

export default function OrderTable({ orders, totalPage }: OrderTableProps) {
  const { openModal } = useModalActions();
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  return (
    <div className="w-full overflow-x-auto space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã</TableHead>
            <TableHead>Địa chỉ nhận</TableHead>
            <TableHead>Tổng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length ? (
            orders.map((order, idx) => (
              <TableRow key={order.code + idx}>
                <TableCell>
                  <div>
                    <p>{order.code.toUpperCase()}</p>
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start">
                    <div className="font-semibold">
                      {order.receiverName}, {order.receiverPhone}
                    </div>
                    <div className="text-xs font-semibold opacity-50">
                      <ClampText
                        text={order.receiverAddress}
                        lines={1}
                        showTitle
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatPrice(order.total)} VNĐ</TableCell>
                <TableCell>
                  <div
                    data-status={order.status}
                    className={`px-2 py-1 rounded-md w-fit ${
                      statusColor[order.status].className
                    }`}
                  >
                    {statusColor[order.status].label}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    {order.status === OrderStatus.PENDING && (
                      <div
                        className="p-1 hover:bg-primary/20 cursor-pointer rounded-md"
                        onClick={() => {
                          openModal({
                            type: "qrCode",
                            props: {
                              qrString: order.code,
                              amount: order.total,
                            },
                          });
                        }}
                      >
                        <QrCode className="text-primary" />
                      </div>
                    )}
                    <div className="p-1 cursor-pointer">
                      <Info />
                    </div>
                    {order.status === OrderStatus.PENDING && (
                      <div className="p-1 hover:bg-red-100 cursor-pointer rounded-md">
                        <CircleX className="text-red-500" />
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                Không có đơn hàng nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {orders.length ? (
        <AppPagination
          currentPage={page}
          totalPage={totalPage}
          isClientSide={true}
        ></AppPagination>
      ) : null}
    </div>
  );
}
