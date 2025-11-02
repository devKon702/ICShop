import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type Config = Record<string, { label: string; color: string }>;

type DataItem<T extends Config> = {
  xLabel: string;
} & {
  [K in keyof T]: number;
};

interface Props<T extends Config> {
  chartConfig: T;
  data: DataItem<T>[];
}

export default function AppAreaChart<T extends Config>({
  chartConfig,
  data,
}: Props<T>) {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: -20,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="xLabel"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          //   tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={3} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        {Object.entries(chartConfig).map(([key, value]) => (
          <Area
            key={key}
            dataKey={key}
            type="monotone"
            fill={value.color}
            fillOpacity={0.4}
            stroke={value.color}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
