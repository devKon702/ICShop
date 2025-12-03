import AppSelector from "@/components/common/app-selector";
import ControlAppPagination from "@/components/common/control-app-pagination";
import DateRangeSelector from "@/components/common/date-range-selector";
import SafeImage from "@/components/common/safe-image";
import AdminOrderRow from "@/components/features/order/admin/admin-order-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ORDER_STATUS_OPTIONS } from "@/constants/enum-options";
import { DeliveryType, OrderStatus } from "@/constants/enums";
import orderService from "@/libs/services/order.service";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone } from "lucide-react";
import React from "react";

interface Props {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
  };
}

export default function AdminUserOrders({ user }: Props) {
  const [filter, setFilter] = React.useState({
    page: 1,
    limit: 10,
    sortBy: "desc" as "asc" | "desc",
    status: OrderStatus.DONE as OrderStatus | undefined,
    from: undefined as Date | undefined,
    to: undefined as Date | undefined,
  });
  const { data } = useQuery({
    queryKey: ["orders", { userId: user.id, ...filter }],
    queryFn: async () =>
      orderService.admin.getByUserId(user.id, {
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
          src={user.avatarUrl ?? undefined}
          avatarPlaceholderName={user.name}
          appFileBase
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <div className="font-semibold text-lg">{user.name}</div>
          <div className="flex items-center space-x-4 text-xs font-semibold opacity-50">
            <p className="flex items-center ">
              <Mail className="p-1" />
              <span>{user.email}</span>
            </p>
            <p className="flex items-center">
              <Phone className="p-1" />
              <span>{user.phone || "-"}</span>
            </p>
          </div>
        </div>
      </div>
      {/* Filter */}
      <div className="flex items-stretch gap-2 ">
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
            <TableHead>Địa chỉ nhận</TableHead>
            <TableHead>Tổng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone || "",
                  },
                }}
                showUser={false}
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
