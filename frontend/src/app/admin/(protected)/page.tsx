"use client";
import { OrderCountChart } from "@/components/features/dashboard/order-count-chart";
import { OrderTypeChart } from "@/components/features/dashboard/order-type-chart";
import SummaryCard from "@/components/features/dashboard/summary-card";
import { OrderStatus } from "@/constants/enums";
import statisticsService from "@/libs/services/statistics.service";

import { useQuery } from "@tanstack/react-query";
import { Clock, SquareMenu, Truck, User } from "lucide-react";
import React from "react";
import TopOrderedProduct from "@/components/features/dashboard/top-ordered-product";
import TopOrderUser from "@/components/features/dashboard/top-order-user";
import DateRangeSelector from "@/components/common/date-range-selector";
import { getDateAgo, getEndOfDay, getStartOfDay } from "@/utils/date";

export default function AdminPage() {
  const [range, setRange] = React.useState<{
    from: Date;
    to: Date;
  }>({
    from: getStartOfDay(getDateAgo("1m")),
    to: getEndOfDay(new Date()),
  });
  const { data: userCount } = useQuery({
    queryKey: ["statistics", "user", "count"],
    queryFn: async () => statisticsService.getUserCount(),
  });

  const { data: orderCountsByStatus } = useQuery({
    queryKey: ["statistics", "order", "by-status", { ...range }],
    queryFn: async () =>
      statisticsService.getOrderCountsByStatus({
        from: range.from,
        to: range.to,
      }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DateRangeSelector
          defaultRange={{
            from: getStartOfDay(getDateAgo("1m")),
            to: getEndOfDay(new Date()),
          }}
          onChange={(range) => {
            if (range.from && range.to) {
              setRange({ from: range.from, to: range.to });
            }
          }}
          placeholder="Tất cả"
          shortcuts={[
            { label: "1 tuần", value: "1w" },
            { label: "2 tuần", value: "2w" },
            { label: "1 tháng", value: "1m" },
            { label: "3 tháng", value: "3m" },
            { label: "6 tháng", value: "6m" },
            { label: "1 năm", value: "1y" },
            { label: "2 năm", value: "2y" },
          ]}
          required
          className="py-1 w-56"
        />
      </div>
      <section className="grid grid-cols-4 space-x-4">
        <SummaryCard
          icon={
            <div className="bg-blue-50 rounded-md p-2">
              <SquareMenu className="text-blue-400" />
            </div>
          }
          title="Đơn hàng"
          value={
            orderCountsByStatus
              ? orderCountsByStatus.data
                  .reduce((acc, curr) => acc + curr.count, 0)
                  .toString()
              : "-"
          }
        />
        <SummaryCard
          icon={
            <div className="bg-orange-50 rounded-md p-2">
              <Clock className="text-orange-400" />
            </div>
          }
          title="Chờ xác nhận"
          value={
            orderCountsByStatus
              ? orderCountsByStatus.data
                  .find((o) => o.status === OrderStatus.PENDING)
                  ?.count.toString() || "0"
              : "-"
          }
        />
        <SummaryCard
          icon={
            <div className="bg-slate-100 rounded-md p-2">
              <Truck className="text-slate-500" />
            </div>
          }
          title="Đang giao"
          value={
            orderCountsByStatus
              ? orderCountsByStatus.data
                  .find((o) => o.status === OrderStatus.SHIPPING)
                  ?.count.toString() || "0"
              : "-"
          }
        />
        <SummaryCard
          icon={
            <div className="bg-green-50 rounded-md p-2">
              <User className="text-green-400" />
            </div>
          }
          title="Người dùng"
          value={userCount ? userCount.data.count.toString() : "-"}
        />
      </section>
      <section className="flex space-x-4">
        <div className="w-7/12 flex flex-col space-y-4">
          <OrderCountChart dateRange={range} />
          <TopOrderUser dateRange={range} />
          <div className="space-x-4"></div>
        </div>
        <div className="w-5/12 space-y-4">
          <OrderTypeChart dateRange={range} />
          <TopOrderedProduct dateRange={range} />
        </div>
      </section>
    </div>
  );
}
