"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import statisticsService from "@/libs/services/statistics.service";
import {
  formatIsoDateTime,
  getDateBeforeDays,
  getEndOfDay,
  getStartOfDay,
} from "@/utils/date";
import { useQuery } from "@tanstack/react-query";
import AppAreaChart from "@/components/common/app-area-chart";
import { useState } from "react";
import AppSelector from "@/components/common/app-selector";

export const description = "An area chart with axes";

const dateOptions = [
  { value: "7", label: "7 ngày" },
  { value: "30", label: "30 ngày" },
  { value: "90", label: "90 ngày" },
  { value: "365", label: "365 ngày" },
] as const;

export function OrderCountChart() {
  const [dateRange, setDateRange] = useState({
    from: getStartOfDay(getDateBeforeDays(new Date(), 7)),
    to: getEndOfDay(new Date()),
  });
  const { data: orderCountDaily } = useQuery({
    queryKey: ["statistics", "order", "daily", { ...dateRange }],
    queryFn: async () => statisticsService.getOrderCountDaily(dateRange),
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Số đơn hàng theo ngày
          <AppSelector
            data={dateOptions}
            defaultValue="7"
            onValueChange={(value) => {
              setDateRange({
                from: getStartOfDay(
                  getDateBeforeDays(new Date(), Number(value))
                ),
                to: getEndOfDay(new Date()),
              });
            }}
            className="ml-auto"
          />
        </CardTitle>
        <CardDescription>
          Biểu đồ số lượng đơn hàng được tạo hàng ngày
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AppAreaChart
          chartConfig={{
            order: {
              label: "Số đơn hàng",
              color: "var(--color-primary)",
            },
          }}
          data={
            orderCountDaily?.data.map((item) => ({
              xLabel:
                new Date(item.from).getDate().toString() +
                "/" +
                (new Date(item.from).getMonth() + 1).toString(),
              order: item.count > 0 ? item.count : 0,
            })) || []
          }
        />
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {/* <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div> */}
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {`${formatIsoDateTime(dateRange.from, {
                date: true,
                time: false,
              })} - ${formatIsoDateTime(dateRange.to, {
                date: true,
                time: false,
              })}`}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
