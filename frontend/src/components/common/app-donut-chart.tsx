import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/utils/className";
import React from "react";
import { Label, Pie, PieChart } from "recharts";

type Config = { value: { label: string } } & {
  [key: string]: { label: string; color: string };
};

type DataItem<T extends Config> = {
  key: keyof T;
  value: number;
};

interface Props<T extends Config> {
  chartConfig: T;
  chartData: DataItem<T>[];
  title: string;
}

export default function AppDonutChart<T extends Config>({
  chartConfig,
  chartData,
  title,
  className,
}: Props<T> & React.ComponentProps<"div">) {
  return (
    <ChartContainer
      config={chartConfig}
      className={cn("mx-auto aspect-square max-w-[300px]", className)}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData.map((item) => ({
            ...item,
            fill: chartConfig[item.key].color,
          }))}
          dataKey="value"
          nameKey="key"
          innerRadius={60}
          strokeWidth={1}
          label
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {chartData
                        .reduce((acc, item) => acc + item.value, 0)
                        .toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {title}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="key" />}
          className="flex-wrap gap-2"
        />
      </PieChart>
    </ChartContainer>
  );
}
