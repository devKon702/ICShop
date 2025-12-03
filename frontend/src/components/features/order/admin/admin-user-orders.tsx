import ControlAppPagination from "@/components/common/control-app-pagination";
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
import { DeliveryType } from "@/constants/enums";
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
  });
  const { data } = useQuery({
    queryKey: ["orders", { userId: user.id, ...filter }],
    queryFn: async () =>
      orderService.admin.getByUserId(user.id, {
        page: filter.page,
        limit: filter.limit,
        sortBy: filter.sortBy,
      }),
  });
  return (
    <div className="p-4 bg-white">
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
      {/* Orders list */}
      <p className="flex w-fit ml-auto font-semibold opacity-50">
        {data?.data.total} đơn hàng
      </p>
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
      {data?.data.total && (
        <ControlAppPagination
          currentPage={filter.page}
          totalPage={Math.ceil((data?.data.total || 0) / filter.limit)}
          onPageChange={(page) => {
            setFilter({ ...filter, page });
          }}
        />
      )}
    </div>
  );
}
