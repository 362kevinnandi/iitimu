"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
} from "recharts";

import { Card, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ProductivityData {
  timeSpent: number; // in minutes
  tasksCompleted: number;
  date: string;
  efficiency: number; // percentage
  focusScore: number; // 0-100
}

interface ProductivityMetrics {
  dailyData: ProductivityData[];
  weeklyData: ProductivityData[];
  monthlyData: ProductivityData[];
  totalTimeSpent: number;
  averageEfficiency: number;
  totalTasksCompleted: number;
  averageFocusScore: number;
}

interface ProductivityTrackerProps {
  metrics: ProductivityMetrics;
  className?: string;
}

const chartConfig = {
  timeSpent: {
    label: "Time Spent",
    color: "hsl(var(--chart-1))",
  },
  tasksCompleted: {
    label: "Tasks Completed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const ProductivityTracker = ({
  metrics,
  className,
}: ProductivityTrackerProps) => {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );

  const data = {
    daily: metrics.dailyData,
    weekly: metrics.weeklyData,
    monthly: metrics.monthlyData,
  }[timeRange];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  return (
    <Card className={`p-2 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
        <CardTitle>Productivity Overview</CardTitle>
        <Select
          defaultValue={timeRange}
          onValueChange={(value: "daily" | "weekly" | "monthly") =>
            setTimeRange(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Time Spent</p>
          <h3 className="text-2xl font-bold">
            {formatTime(metrics.totalTimeSpent)}
          </h3>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tasks Completed</p>
          <h3 className="text-2xl font-bold">{metrics.totalTasksCompleted}</h3>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Avg. Efficiency</p>
          <h3 className="text-2xl font-bold">{metrics.averageEfficiency}%</h3>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Avg. Focus Score</p>
          <h3 className="text-2xl font-bold">
            {metrics.averageFocusScore}/100
          </h3>
        </Card>
      </div>

      <Tabs defaultValue="time" className="w-full">
        <TabsList>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
          <TabsTrigger value="tasks">Tasks Completion</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
        </TabsList>

        <TabsContent value="time" className="h-[400px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              accessibilityLayer
              data={data}
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
                formatter={(value: number) =>
                  `Time Spent: ${formatTime(value)}`
                }
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                dataKey="timeSpent"
                type="natural"
                stroke="var(--color-timeSpent)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="tasks" className="h-[400px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                formatter={(value: number) => `Tasks Completed: ${value}`}
                labelFormatter={(label) => ` ${label}`}
              />
              <Bar
                dataKey="tasksCompleted"
                fill="var(--color-tasksCompleted)"
                radius={8}
              />
            </BarChart>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="efficiency" className="h-[400px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Legend />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="efficiency"
                type="monotone"
                stroke="hsl(var(--chart-1))"
                name="Efficiency %"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="focusScore"
                type="monotone"
                stroke="hsl(var(--chart-2))"
                name="Focus Score"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
