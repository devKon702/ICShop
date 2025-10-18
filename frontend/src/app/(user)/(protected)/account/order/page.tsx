"use client";
import AppSelector from "@/components/common/app-selector";
import SetBreadCrump from "@/components/common/set-breadcrump";
import OrderTable from "@/components/features/order/user/order-table";
import { DeliveryType, OrderStatus } from "@/constants/enums";
import orderService from "@/libs/services/order.service";
import { useQuery } from "@tanstack/react-query";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import React from "react";

const orderOptions = [
  { value: "create_desc", label: "Mới nhất" },
  { value: "create_asc", label: "Cũ nhất" },
  { value: "update_desc", label: "Cập nhật mới nhất" },
  { value: "update_asc", label: "Cập nhật cũ nhất" },
] as const;

const statusOptions = [
  { value: "-1", label: "Tất cả" },
  { value: OrderStatus.PENDING.toString(), label: "Chờ xác nhận" },
  { value: OrderStatus.PAID.toString(), label: "Đã thanh toán" },
  { value: OrderStatus.PROCESSING.toString(), label: "Đang xử lí" },
  { value: OrderStatus.SHIPPING.toString(), label: "Đang giao" },
  { value: OrderStatus.DONE.toString(), label: "Hoàn thành" },
  { value: OrderStatus.CANCELED.toString(), label: "Đã hủy" },
] as const;

export default function OrderPage() {
  const [query, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(5),
    status: parseAsInteger,
    order: parseAsStringLiteral(
      orderOptions.map((item) => item.value)
    ).withDefault("create_desc"),
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
        order: query.order,
        status: query.status ?? undefined,
        from: query.from.toISOString(),
        to: query.to.toISOString(),
      }),
  });
  return (
    <div>
      <SetBreadCrump
        breadcrumps={[
          { label: "Trang chủ", href: "/" },
          {
            label: "Tài khoản",
            href: "/account",
          },
          {
            label: "Đơn hàng",
            href: "/account/order",
          },
        ]}
      ></SetBreadCrump>
      <h1 className="font-medium text-2xl mb-4">Đơn hàng</h1>
      <div className="flex space-x-2 mb-2">
        <div className="w-1/4 ms-auto space-y-2">
          <p className="font-semibold text-sm">Trạng thái</p>
          <AppSelector
            data={statusOptions.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            defaultValue={query.status?.toString() || "-1"}
            onValueChange={(value) => {
              setQuery({
                ...query,
                status:
                  value === "-1"
                    ? null
                    : (Number(value) as typeof query.status),
              });
            }}
            className="w-full"
          ></AppSelector>
        </div>
        <div className="w-1/4 space-y-2">
          <p className="font-semibold text-sm">Sắp xếp</p>
          <AppSelector
            data={orderOptions.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            defaultValue={query.order}
            onValueChange={(value) =>
              setQuery({ ...query, order: value as typeof query.order })
            }
            className="w-full"
          ></AppSelector>
        </div>
      </div>

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
