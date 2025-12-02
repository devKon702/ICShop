"use client";
import AppPagination from "@/components/common/app-pagination";
import AdminOrderRow from "@/components/features/order/admin/admin-order-row";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DeliveryType, OrderStatus } from "@/constants/enums";
import orderService from "@/libs/services/order.service";
import { useQuery } from "@tanstack/react-query";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import React from "react";

export default function AdminOrderTable() {
  const [query] = useQueryStates({
    code: parseAsString,
    receiverPhone: parseAsString,
    email: parseAsString,
    from: parseAsIsoDateTime,
    to: parseAsIsoDateTime,
    sortBy: parseAsStringLiteral(["create_asc", "create_desc"]).withDefault(
      "create_desc"
    ),
    isActive: parseAsBoolean,
    status: parseAsNumberLiteral([
      OrderStatus.CANCELED,
      OrderStatus.PENDING,
      OrderStatus.PAID,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPING,
      OrderStatus.DONE,
    ]),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  });
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", { ...query }],
    queryFn: async () =>
      orderService.admin.filter({
        status: query.status ?? undefined,
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        isActive: query.isActive || undefined,
        receiverPhone: query.receiverPhone || undefined,
        email: query.email || undefined,
        code: query.code || undefined,
        from: query.from ? query.from.toISOString() : undefined,
        to: query.to ? query.to.toISOString() : undefined,
      }),
  });
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã</TableHead>
            <TableHead>Người đặt</TableHead>
            <TableHead>Địa chỉ nhận</TableHead>
            <TableHead>Tổng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <Skeleton className="h-8 w-full" />
              </TableCell>
            </TableRow>
          ) : ordersData?.data.result.length ? (
            ordersData.data.result.map((order) => (
              <AdminOrderRow
                key={order.id}
                order={{
                  id: order.id,
                  code: order.code,
                  createdAt: order.createdAt.toLocaleString(),
                  receiverAddress:
                    order.deliveryType === DeliveryType.POST
                      ? new Array([
                          order.detail,
                          order.commune,
                          order.district,
                          order.province,
                        ]).join(", ")
                      : "Tại cửa hàng",
                  receiverName: order.receiverName,
                  receiverPhone: order.receiverPhone,
                  total: Number(order.total),
                  status: order.status,
                  user: {
                    id: order.user.id,
                    email: order.user.account.email,
                    name: order.user.name,
                    phone: order.user.phone || "",
                  },
                }}
              />
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
      {ordersData?.data.total ? (
        <AppPagination
          currentPage={ordersData.data.page}
          totalPage={Math.ceil(ordersData.data.total / ordersData.data.limit)}
          isClientSide={true}
        ></AppPagination>
      ) : null}
    </div>
  );
}
