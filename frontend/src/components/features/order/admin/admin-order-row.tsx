import ClampText from "@/components/common/clamp-text";
import ChangeOrderStatusForm from "@/components/features/order/admin/change-order-status-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import { OrderStatus } from "@/constants/enums";
import { ORDER_STATUS_OPTIONS } from "@/constants/enum-options";
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
  const [openPopover, setOpenPopover] = React.useState(false);
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
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
          <PopoverTrigger>
            <div
              className={`rounded-md px-2 py-1 w-fit cursor-pointer ${
                ORDER_STATUS_OPTIONS.find((item) => item.value === order.status)
                  ?.color
              }`}
            >
              {
                ORDER_STATUS_OPTIONS.find((item) => item.value === order.status)
                  ?.label
              }
            </div>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="left"
            className="w-fit min-w-[40dvw] "
            sideOffset={10}
          >
            <ChangeOrderStatusForm
              orderId={order.id}
              currentStatus={order.status}
              title={`Đơn hàng ${order.code.toUpperCase()}`}
              onSuccess={() => setOpenPopover(false)}
            />
          </PopoverContent>
        </Popover>
        {/* <div
          className={`rounded-md px-2 py-1 w-fit cursor-pointer ${
            ORDER_STATUS_OPTIONS.find((item) => item.value === order.status)
              ?.color
          }`}
          onClick={() => {
            openModal({
              type: "changeOrderStatus",
              props: { orderId: order.id, currentStatus: order.status },
            });
          }}
        >
          {
            ORDER_STATUS_OPTIONS.find((item) => item.value === order.status)
              ?.label
          }
        </div> */}
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
