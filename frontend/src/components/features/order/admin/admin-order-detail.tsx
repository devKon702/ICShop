"use client";
import ClampText from "@/components/common/clamp-text";
import SafeImage from "@/components/common/safe-image";
import Separator from "@/components/common/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DeliveryType } from "@/constants/enums";
import env from "@/constants/env";
import { ORDER_STATUS_OPTIONS } from "@/constants/order-status";
import orderService from "@/libs/services/order.service";
import { formatIsoDateTime } from "@/utils/date";
import { formatPrice } from "@/utils/price";
import { useQuery } from "@tanstack/react-query";
import { LucideAlertCircle } from "lucide-react";
import React from "react";

// const statusItems = {
//   [OrderStatus.CANCELED]: {
//     label: "Đã hủy",
//     className: "bg-red-100 text-red-500 bg-red-500/10",
//   },
//   [OrderStatus.PENDING]: {
//     label: "Chờ xác nhận",
//     className: "bg-yellow-100 text-yellow-500 bg-yellow-500/10",
//   },
//   [OrderStatus.PAID]: {
//     label: "Đã thanh toán",
//     className: "bg-green-100 text-green-500 bg-green-500/10",
//   },
//   [OrderStatus.PROCESSING]: {
//     label: "Đang xử lí",
//     className: "bg-blue-100 text-blue-500 bg-blue-500/10",
//   },
//   [OrderStatus.SHIPPING]: {
//     label: "Đang giao",
//     className: "bg-indigo-100 text-indigo-500 bg-indigo-500/10",
//   },
//   [OrderStatus.DONE]: {
//     label: "Hoàn thành",
//     className: "bg-gray-100 text-gray-500 bg-gray-500/10",
//   },
// };

interface AdminOrderDetailProps {
  orderId: number;
}

export default function AdminOrderDetail({ orderId }: AdminOrderDetailProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["order", { id: orderId }],
    queryFn: async () => orderService.admin.getById(orderId),
  });
  if (isLoading) return <Skeleton className="w-[50dvw] h-[50dvh]"></Skeleton>;
  if (error)
    return (
      <div className="w-[50dvw] h-[50dvh] flex flex-col items-center justify-center text-destructive">
        <LucideAlertCircle className="w-12 h-12 mb-2" />
        <span>Failed to load order details.</span>
      </div>
    );
  return (
    data?.data && (
      <div className="p-2 min-w-[70dvw] space-y-2">
        {/* Người đặt, nhận */}
        <section className="flex gap-2 items-stretch">
          <div className="flex flex-col rounded-md shadow border flex-1">
            <p className="bg-primary/10 p-2 font-semibold">Người đặt</p>
            <div className="bg-white p-2 flex flex-col gap-1 flex-1">
              <p>{data.data.user.name}</p>
              <p>
                {data.data.user.account.email} - {data.data.user.phone}{" "}
              </p>
            </div>
          </div>
          <div className="rounded-md shadow border flex-1">
            <p className="bg-primary/10 p-2 font-semibold">Người nhận</p>
            <div className="bg-white p-2 flex flex-col gap-1">
              <p>{data.data.receiverName}</p>
              <p>{data.data.receiverPhone} </p>
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
                  <p className="text-sm font-semibold opacity-50">
                    {data.data.deliveryType === DeliveryType.SHOP
                      ? "Tại cửa hàng"
                      : new Array([
                          data.data.detail,
                          data.data.commune,
                          data.data.district,
                          data.data.province,
                        ]).join(", ")}
                  </p>
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
              {data.data.details.map((detail) => (
                <div
                  key={detail.id}
                  className="bg-white p-2 flex items-center space-x-4"
                >
                  <SafeImage
                    src={`${env.NEXT_PUBLIC_FILE_URL}/${detail.product.posterUrl}`}
                    alt={detail.product.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex-1">
                    <ClampText
                      lines={2}
                      text={detail.product.name}
                      className="font-semibold"
                    />
                    <div className="flex items-center space-x-4">
                      <p className="text-sm font-semibold opacity-50">
                        {formatPrice(Number(detail.product.price))} VNĐ /{" "}
                        {detail.unit}
                      </p>
                      <p className="font-semibold">x{detail.quantity}</p>
                      <p className="font-semibold ms-auto">
                        {formatPrice(
                          Number(detail.unitPrice) * detail.quantity
                        )}{" "}
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
    )
  );
}
