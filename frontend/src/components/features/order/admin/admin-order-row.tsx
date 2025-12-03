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
import ZaloLink from "@/components/common/zalo-link";
import MailLink from "@/components/common/mail-link";

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
  showUser?: boolean;
}

export default function AdminOrderRow({
  order,
  showUser = true,
}: AdminOrderRowProps) {
  const [openPopover, setOpenPopover] = React.useState(false);
  const { openModal } = useModalActions();

  return (
    <TableRow>
      <TableCell>
        <div>
          <p>{order.code.toUpperCase()}</p>
          <p className="font-semibold text-xs opacity-50">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </TableCell>
      {showUser && (
        <TableCell>
          <div className="flex flex-col items-start">
            <div className="font-semibold">
              {order.user.name},{" "}
              <ZaloLink
                phone={order.user.phone}
                className="hover:underline"
                title={`Zalo: ${order.user.phone}`}
              >
                {order.user.phone}
              </ZaloLink>
            </div>
            <MailLink
              email={order.user.email}
              className="text-xs font-semibold opacity-50 hover:underline"
              title={`Email: ${order.user.email}`}
            >
              {order.user.email}
            </MailLink>
          </div>
        </TableCell>
      )}
      <TableCell>
        <div className="flex flex-col items-start">
          <div className="font-semibold">
            {order.receiverName},{" "}
            <ZaloLink
              phone={order.receiverPhone}
              className="hover:underline"
              title={`Zalo: ${order.receiverPhone}`}
            >
              {order.receiverPhone}
            </ZaloLink>
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
