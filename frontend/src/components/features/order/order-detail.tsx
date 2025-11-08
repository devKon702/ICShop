import ClampText from "@/components/common/clamp-text";
import SafeImage from "@/components/common/safe-image";
import Separator from "@/components/common/separator";
import { ORDER_STATUS_OPTIONS } from "@/constants/enum-options";
import { DeliveryType } from "@/constants/enums";
import { formatIsoDateTime } from "@/utils/date";
import { formatPrice } from "@/utils/price";
import React from "react";

interface Props {
  order: {
    id: number;
    code: string;
    status: number;
    createdAt: string;
    receiverName: string;
    receiverPhone: string;
    deliveryType: number;
    detail: string;
    commune: string;
    district: string;
    province: string;
    total: number;
  };
  products: {
    id: number;
    name: string;
    posterUrl: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    slug: string;
  }[];
  timelines: { id: number; status: number; desc: string; createdAt: string }[];
}

export default function OrderDetail({ order, products, timelines }: Props) {
  return (
    <div className="p-2 min-w-[70dvw] space-y-2">
      {/* Người nhận */}
      <section className="flex gap-2 items-stretch">
        <div className="rounded-md shadow border flex-1">
          <p className="bg-primary/10 p-2 font-semibold">Người nhận</p>
          <div className="bg-white p-2 flex flex-col gap-1">
            <p>{order.receiverName}</p>
            <p>{order.receiverPhone} </p>
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
                <p className="text-sm font-semibold opacity-50">{order.code}</p>
              </div>
              <div>
                <p className="font-semibold">Trạng thái:</p>{" "}
                <p className="text-sm font-semibold opacity-50">
                  {ORDER_STATUS_OPTIONS[order.status].label}
                </p>
              </div>
              <div>
                <p className="font-semibold">Ngày đặt:</p>

                <p className="text-sm font-semibold opacity-50">
                  {formatIsoDateTime(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="font-semibold">Địa chỉ giao hàng:</p>
                <p className="text-sm font-semibold opacity-50">
                  {order.deliveryType === DeliveryType.SHOP
                    ? "Tại cửa hàng"
                    : new Array([
                        order.detail,
                        order.commune,
                        order.district,
                        order.province,
                      ]).join(", ")}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-md shadow border overflow-hidden">
            <p className="bg-primary/10 p-2 font-semibold">
              Lịch sử trạng thái
            </p>
            {timelines.map((timeline, index) => (
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
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-2 flex items-center space-x-4"
              >
                <SafeImage
                  src={product.posterUrl}
                  alt={product.name}
                  width={64}
                  height={64}
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
                      {formatPrice(Number(product.unitPrice))} VNĐ /{" "}
                      {product.unit}
                    </p>
                    <p className="font-semibold">x{product.quantity}</p>
                    <p className="font-semibold ms-auto">
                      {formatPrice(
                        Number(product.unitPrice) * product.quantity
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
                {formatPrice(Number(order.total))} VNĐ
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
