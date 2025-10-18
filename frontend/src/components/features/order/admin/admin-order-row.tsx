import AppSelector from "@/components/common/app-selector";
import ClampText from "@/components/common/clamp-text";
import { TableCell, TableRow } from "@/components/ui/table";
import { OrderStatus } from "@/constants/enums";
import { ORDER_STATUS_OPTIONS } from "@/constants/order-status";
import { useModalActions } from "@/store/modal-store";
import { formatPrice } from "@/utils/price";
import { Info } from "lucide-react";
import React from "react";

interface AdminOrderRowProps {
  order: {
    id: number;
    code: string;
    createdAt: string;
    receiverAddress: string;
    receiverName: string;
    receiverPhone: string;
    total: number;
    status: OrderStatus;
    user: {
      id: number;
      email: string;
      name: string;
      phone: string;
    };
  };
}

export default function AdminOrderRow({ order }: AdminOrderRowProps) {
  const { openModal } = useModalActions();
  return (
    <TableRow>
      <TableCell>
        <div>
          <p>{order.code.toUpperCase()}</p>
          <p>{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-start">
          <div className="font-semibold">
            {order.user.name}, {order.user.phone}
          </div>
          <div className="text-xs font-semibold opacity-50">
            {order.user.email}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-start">
          <div className="font-semibold">
            {order.receiverName}, {order.receiverPhone}
          </div>
          <div className="text-xs font-semibold opacity-50">
            <ClampText text={order.receiverAddress} lines={1} showTitle />
          </div>
        </div>
      </TableCell>
      <TableCell>{formatPrice(order.total)} VNĐ</TableCell>
      <TableCell>
        <AppSelector
          data={ORDER_STATUS_OPTIONS.map(({ label, value }) => ({
            label,
            value: value.toString(),
          }))}
          data-status={order.status}
          className={`${ORDER_STATUS_OPTIONS.map(
            (item) => `data-[status=${item.value}]: ${item.color}`
          ).join(" ")} px-2 py-1 rounded-md w-fit cursor-pointer`}
          defaultValue={order.status.toString()}
          onValueChange={(value) => {
            openModal({
              type: "prompt",
              props: {
                title: "Ghi chú",
                defaultValue: ORDER_STATUS_OPTIONS.find(
                  (item) => item.value.toString() === value
                )?.label,
                onSubmit: (note) => {
                  console.log("Change status", {
                    orderId: order.id,
                    newStatus: value,
                    note,
                  });
                },
              },
            });
          }}
        ></AppSelector>
      </TableCell>
      <TableCell>
        <div className="flex gap-2 items-center">
          <div
            className="p-1 cursor-pointer"
            onClick={() =>
              openModal({
                type: "adminOrderDetail",
                props: { orderId: order.id },
              })
            }
          >
            <Info />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
