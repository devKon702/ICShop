"use client";
import OrderTable from "@/components/features/order/order-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeliveryType } from "@/constants/enums";
import orderService from "@/libs/services/order.service";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import React from "react";

export default function OrderPage() {
  const [query, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(5),
    status: parseAsInteger,
    order: parseAsStringLiteral([
      "create_asc",
      "create_desc",
      "update_asc",
      "update_desc",
    ]).withDefault("create_desc"),
    from: parseAsIsoDateTime.withDefault(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ),
    to: parseAsIsoDateTime.withDefault(new Date()),
  });
  const { data } = useQuery({
    queryKey: ["orders", { ...query }],
    queryFn: async () =>
      orderService.user.filter({
        page: query.page,
        limit: query.limit,
        order: "create_desc",
        status: undefined,
        from: query.from.toISOString(),
        to: query.to.toISOString(),
      }),
  });
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
        orders={
          data?.data.result.map((order) => ({
            id: order.id,
            code: order.code,
            createdAt: order.createdAt.toLocaleString(),
            receiverAddress:
              order.deliveryType === DeliveryType.POST
                ? order.detail +
                  ", " +
                  order.commune +
                  ", " +
                  order.district +
                  ", " +
                  order.province
                : "Nhận tại cửa hàng",
            receiverName: order.receiverName,
            receiverPhone: order.receiverPhone,
            total: Number(order.total),
            status: order.status,
          })) || []
        }
        totalPage={data?.data ? Math.ceil(data.data.total / query.limit) : 1}
      />
    </div>
  );
}
