"use client";
import ClampText from "@/components/common/clamp-text";
import SafeImage from "@/components/common/safe-image";
import Separator from "@/components/common/separator";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_OPTIONS } from "@/constants/enum-options";
import { DeliveryType, OrderStatus } from "@/constants/enums";
import orderService from "@/libs/services/order.service";
import { useModalActions } from "@/store/modal-store";
import { formatIsoDateTime } from "@/utils/date";
import { formatPrice } from "@/utils/price";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
  orderId: number;
}

export default function UserOrderDetail({ orderId }: Props) {
  const { openModal } = useModalActions();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["orders", { id: orderId }],
    queryFn: async () => orderService.user.getById(orderId),
  });

  const { mutate: changeAddressMutate } = useMutation({
    mutationFn: (addressId: number) => Promise.resolve(addressId),
    onSuccess: () => {
      toast.success("Thay đổi địa chỉ thành công");

      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  if (!data) return null;
  return (
    <div className="p-2 min-w-[70dvw] space-y-2">
      {/* Người nhận */}
      <section className="flex gap-2 items-stretch">
        <div className="rounded-md shadow border flex-1">
          <div className="bg-primary/10 p-2 font-semibold flex items-center justify-between gap-2">
            <p className=" font-semibold">Địa chỉ nhận</p>
            {[OrderStatus.PENDING, OrderStatus.PAID].includes(
              data.data.status
            ) && (
              <Button
                onClick={() =>
                  openModal({
                    type: "selectAddress",
                    props: {
                      onSubmit: async (addressId: number) => {
                        if (confirm("Xác nhận thay đổi địa chỉ nhận?")) {
                          changeAddressMutate(addressId);
                        }
                      },
                    },
                  })
                }
              >
                <MapPin />
                Thay đổi
              </Button>
            )}
          </div>
          <div className="bg-white p-2 flex flex-col gap-1">
            <p className="font-semibold">
              {data.data.receiverName} - {data.data.receiverPhone}
            </p>
            <p className="text-sm font-semibold opacity-50">
              {data.data.deliveryType === DeliveryType.SHOP
                ? "Tại cửa hàng"
                : [
                    data.data.detail,
                    data.data.commune,
                    data.data.district,
                    data.data.province,
                  ].join(", ")}
            </p>
          </div>
        </div>
      </section>
      {/* Thông tin đơn hàng */}
      <section className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <div className="rounded-md shadow border">
            <p className="bg-primary/10 p-2 font-semibold">
              Thông tin đơn hàng
            </p>
            <div className="bg-white p-2 grid grid-cols-2 gap-x-20 gap-y-6">
              <div>
                <p className="font-semibold">Mã</p>
                <p className="text-sm font-semibold opacity-50">
                  {data.data.code}
                </p>
              </div>
              <div>
                <p className="font-semibold">Trạng thái:</p>{" "}
                <p className="text-sm font-semibold opacity-50">
                  {ORDER_STATUS_OPTIONS[data.data.status].label}
                </p>
              </div>
              <div>
                <p className="font-semibold">Ngày đặt:</p>

                <p className="text-sm font-semibold opacity-50">
                  {formatIsoDateTime(data.data.createdAt)}
                </p>
              </div>
              <div>
                <p className="font-semibold">Địa chỉ giao hàng:</p>
              </div>
            </div>
          </div>
          <div className="rounded-md shadow border overflow-hidden">
            <p className="bg-primary/10 p-2 font-semibold">
              Lịch sử trạng thái
            </p>
            {data.data.timelines.map((timeline, index) => (
              <div
                key={timeline.id}
                className="bg-white p-2 flex items-center space-x-4 border"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full size-4 ${
                      index == 0 ? "bg-primary" : "border-2 border-primary"
                    }`}
                  ></div>
                </div>
                <div className="flex w-full items-center gap-4">
                  <div className="flex-1">
                    <p className="font-semibold">
                      {ORDER_STATUS_OPTIONS[timeline.status].label}
                    </p>
                    <p className="text-sm font-semibold opacity-50">
                      {timeline.desc}
                    </p>
                  </div>
                  <p className="font-semibold text-sm ml-auto w-fit">
                    {formatIsoDateTime(timeline.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Product List */}
        <div className="rounded-md shadow border h-fit bg-white">
          <p className="font-semibold bg-primary/10 p-2">Sản phẩm</p>
          <div>
            {data.data.details.map(({ product, ...detail }) => (
              <div
                key={product.id}
                className="bg-white p-2 flex items-center space-x-4"
              >
                <SafeImage
                  src={product.posterUrl ?? undefined}
                  alt={product.name}
                  width={64}
                  height={64}
                  appFileBase
                  className="w-16 h-16 object-cover"
                />
                <div className="flex-1">
                  <ClampText
                    lines={2}
                    text={product.name}
                    className="font-semibold"
                  />
                  <div className="flex items-center space-x-4">
                    <p className="text-sm font-semibold opacity-50">
                      {formatPrice(Number(detail.unitPrice))} VNĐ /{" "}
                      {detail.unit}
                    </p>
                    <p className="font-semibold">x{detail.quantity}</p>
                    <p className="font-semibold ms-auto">
                      {formatPrice(Number(detail.unitPrice) * detail.quantity)}{" "}
                      VNĐ
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className="p-2 gap-2">
            <div className="flex justify-between">
              <span className="font-semibold text-xl">Tổng:</span>
              <span className="font-semibold text-xl">
                {formatPrice(Number(data.data.total))} VNĐ
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
