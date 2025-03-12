"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface WorkspaceChartsProps {
  tasksByStatus: Record<string, number>;
  tasksTrend: {
    date: string;
    count: number;
  }[];
}

const chartConfig = {
  todo: {
    label: "Status",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Done",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const barColors = {
  TODO: "hsl(var(--chart-1))",
  COMPLETED: "hsl(var(--chart-2))",
  IN_PROGRESS: "hsl(var(--chart-3))",
  BACKLOG: "hsl(var(--chart-4))",
  BLOCKED: "hsl(var(--chart-5))",
  IN_REVIEW: "hsl(var(--chart-6))",
};

export const WorkspaceCharts = ({
  tasksByStatus,
  tasksTrend,
}: WorkspaceChartsProps) => {
  const barChartData = Object.entries(tasksByStatus).map(([status, count]) => ({
    status,
    count,
    fill: barColors[status as keyof typeof barColors],
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Status</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={barChartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="count" fill="fill" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Creation Trend</CardTitle>
          <CardDescription>Task creation trend (last 7 days)</CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <LineChart
                accessibilityLayer
                data={tasksTrend}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="count"
                  type="natural"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{
                    fill: "hsl(var(--chart-1))",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
