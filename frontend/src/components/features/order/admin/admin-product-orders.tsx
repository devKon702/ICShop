import orderService from "@/libs/services/order.service";
import { useQuery } from "@tanstack/react-query";
import AdminOrderRow from "@/components/features/order/admin/admin-order-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import SafeImage from "@/components/common/safe-image";
import { DeliveryType, OrderStatus } from "@/constants/enums";
import ControlAppPagination from "@/components/common/control-app-pagination";
import AppSelector from "@/components/common/app-selector";
import DateRangeSelector from "@/components/common/date-range-selector";
import { ORDER_STATUS_OPTIONS } from "@/constants/enum-options";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  product: {
    id: number;
    name: string;
    posterUrl: string | null;
  };
}

export default function AdminProductOrders({ product }: Props) {
  const [filter, setFilter] = React.useState({
    page: 1,
    limit: 10,
    sortBy: "desc" as "asc" | "desc",
    status: OrderStatus.DONE as OrderStatus | undefined,
    from: undefined as Date | undefined,
    to: undefined as Date | undefined,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["orders", { productId: product.id, ...filter }],
    queryFn: async () =>
      orderService.admin.getByProductId(product.id, {
        page: filter.page,
        limit: filter.limit,
        sortBy: filter.sortBy,
        status: filter.status,
        from: filter.from,
        to: filter.to,
      }),
  });
  return (
    <div className="p-4 bg-white min-h-[80dvh]">
      {/* User info */}
      <div className="flex items-center gap-4 mb-4 min-w-[50dvw]">
        <SafeImage
          src={product.posterUrl ?? undefined}
          appFileBase
          width={50}
          height={50}
          className="rounded-md"
        />
        <div className="font-semibold text-lg">{product.name}</div>
      </div>
      {/* Filter */}
      <div className="flex items-stretch gap-2">
        <AppSelector
          data={
            [
              ...ORDER_STATUS_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              })),
              { label: "Tất cả", value: "all" },
            ] as const
          }
          defaultValue={filter.status ?? "all"}
          className="flex-1"
          onValueChange={(value) => {
            setFilter({
              ...filter,
              status: value === "all" ? undefined : (value as OrderStatus),
            });
          }}
        />
        <div className="flex-1 mr-16">
          <DateRangeSelector
            placeholder="Tất cả"
            onChange={(range) => {
              setFilter({
                ...filter,
                from: range?.from,
                to: range?.to,
              });
            }}
            shortcuts={[
              { label: "1 tháng", value: "1m" },
              { label: "3 tháng", value: "3m" },
              { label: "Tất cả", value: null },
            ]}
            className=""
          />
        </div>
        <p className="flex w-fit ml-auto mt-auto font-semibold opacity-50">
          {data?.data.total} đơn hàng
        </p>
      </div>
      {/* Orders list */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã</TableHead>
            <TableHead>Người tạo</TableHead>
            <TableHead>Địa chỉ nhận</TableHead>
            <TableHead>Tổng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? <Skeleton className="h-10 w-full" /> : null}
          {data?.data.result.length ? (
            data.data.result.map((order) => (
              <AdminOrderRow
                key={order.id}
                order={{
                  id: order.id,
                  code: order.code,
                  createdAt: order.createdAt.toLocaleString(),
                  receiverAddress:
                    order.deliveryType === DeliveryType.POST
                      ? [
                          order.detail,
                          order.commune,
                          order.district,
                          order.province,
                        ].join(", ")
                      : "Tại cửa hàng",
                  receiverName: order.receiverName,
                  receiverPhone: order.receiverPhone,
                  total: Number(order.total),
                  status: order.status,
                  user: {
                    id: order.user.id,
                    name: order.user.name,
                    email: order.user.account.email,
                    phone: order.user.phone || "",
                  },
                }}
                showUser
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Không có đơn hàng nào
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {data?.data.total ? (
        <ControlAppPagination
          currentPage={filter.page}
          totalPage={Math.ceil((data?.data.total || 0) / filter.limit)}
          onPageChange={(page) => {
            setFilter({ ...filter, page });
          }}
        />
      ) : null}
    </div>
  );
}
