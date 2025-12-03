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
import { DeliveryType } from "@/constants/enums";
import ControlAppPagination from "@/components/common/control-app-pagination";

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
  });
  const { data, isLoading } = useQuery({
    queryKey: ["orders", { productId: product.id, ...filter }],
    queryFn: async () =>
      orderService.admin.getByProductId(product.id, {
        page: filter.page,
        limit: filter.limit,
        sortBy: filter.sortBy,
      }),
  });
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="p-4 bg-white">
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
      {/* Orders list */}
      <p className="flex w-fit ml-auto font-semibold opacity-50">
        {data?.data.total} đơn hàng
      </p>
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
