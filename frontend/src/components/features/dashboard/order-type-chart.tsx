"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import statisticsService from "@/libs/services/statistics.service";
import AppDonutChart from "@/components/common/app-donut-chart";
import { ORDER_STATUS_OPTIONS } from "@/constants/enum-options";

export const description = "A donut chart with text";

export function OrderTypeChart() {
  const { data: orderCountsByStatus } = useQuery({
    queryKey: ["statistics", "order", "by-status"],
    queryFn: async () => statisticsService.getOrderCountsByStatus(),
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tỉ lệ đơn hàng theo trạng thái</CardTitle>
        <CardDescription>Biểu đồ tỉ lệ đơn hàng</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <AppDonutChart
          chartConfig={
            {
              value: { label: "Đơn hàng", color: "" },
              [ORDER_STATUS_OPTIONS[3].value.toString()]: {
                label: ORDER_STATUS_OPTIONS[3].label,
                color: "var(--color-blue-500)",
              },
              [ORDER_STATUS_OPTIONS[2].value.toString()]: {
                label: ORDER_STATUS_OPTIONS[2].label,
                color: "var(--color-yellow-500)",
              },
              [ORDER_STATUS_OPTIONS[1].value.toString()]: {
                label: ORDER_STATUS_OPTIONS[1].label,
                color: "var(--color-gray-500)",
              },
              [ORDER_STATUS_OPTIONS[0].value.toString()]: {
                label: ORDER_STATUS_OPTIONS[0].label,
                color: "var(--color-red-500)",
              },
              [ORDER_STATUS_OPTIONS[4].value.toString()]: {
                label: ORDER_STATUS_OPTIONS[4].label,
                color: "var(--color-indigo-500)",
              },
              [ORDER_STATUS_OPTIONS[5].value.toString()]: {
                label: ORDER_STATUS_OPTIONS[5].label,
                color: "var(--color-green-500)",
              },
            } as const
          }
          chartData={
            orderCountsByStatus
              ? orderCountsByStatus.data.map((item) => ({
                  key: item.status.toString(),
                  value: item.count,
                }))
              : []
          }
          title="Đơn hàng"
        />
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="text-muted-foreground leading-none">
          {/* Tháng 3 - Tháng 6 | 2025 */}
        </div>
      </CardFooter>
    </Card>
  );
}
