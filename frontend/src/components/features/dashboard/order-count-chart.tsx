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
import { formatIsoDateTime } from "@/utils/date";
import { useQuery } from "@tanstack/react-query";
import AppAreaChart from "@/components/common/app-area-chart";

export const description = "An area chart with axes";

interface Props {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function OrderCountChart({ dateRange }: Props) {
  const { data: orderCountDaily } = useQuery({
    queryKey: ["statistics", "order", "daily", { ...dateRange }],
    queryFn: async () => statisticsService.getOrderCountDaily(dateRange),
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Số đơn hàng theo ngày
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
