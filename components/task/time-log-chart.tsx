"use client";

import { TimeLog } from "@prisma/client";
import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, TooltipProps, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "../ui/chart";

interface TimeLogChartProps {
  timeLogs: TimeLog[];
  isLoading?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Date
            </span>
            <span className="font-bold text-muted-foreground">{label}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Duration
            </span>
            <span className="font-bold">{payload[0].value} minutes</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const chartConfig = {
  duration: {
    label: "Duration",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const TimeLogChart = ({ timeLogs }: TimeLogChartProps) => {
  const chartData = timeLogs?.map((log) => ({
    date: format(new Date(log.startTime), "MMM dd"),
    duration: log.duration ? Math.round(log.duration / 60) : 0, // Convert seconds to minutes
  }));
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Time Tracking History</CardTitle>
        <CardDescription>Time spent on task per day in minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<CustomTooltip />} />
            <Bar dataKey="duration" fill="var(--color-duration)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
