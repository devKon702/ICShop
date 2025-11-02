import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  chartConfig: { label: string; color: string };
  data: { label: string; value: number }[];
}

export default function SingleAreaChart({ chartConfig, data }: Props) {
  const config = { value: chartConfig } satisfies ChartConfig;
  return (
    <ChartContainer config={config}>
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
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={3} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="line"
          type="natural"
          fill="var(--color-line)"
          fillOpacity={0.4}
          stroke="var(--color-line)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
