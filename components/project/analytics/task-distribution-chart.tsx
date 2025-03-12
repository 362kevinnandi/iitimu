"use client";

import { TrendingUp } from "lucide-react";
import * as React from "react";
import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface TaskDistributionProps {
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },

  inProgress: {
    label: "In Progress",
  },

  overdue: {
    label: "Overdue",
  },

  todo: {
    label: "Todo",
  },
} satisfies ChartConfig;

export const TaskDistributionChart = ({ tasks }: TaskDistributionProps) => {
  const data = [
    { name: "Completed", value: tasks.completed, fill: "#22c55e" },
    { name: "In Progress", value: tasks.inProgress, fill: "#f59e0b" },
    { name: "Overdue", value: tasks.overdue, fill: "red" },
    {
      name: "Todo",
      value: tasks.total - (tasks.completed + tasks.inProgress + tasks.overdue),
      fill: "#3b82f6",
    },
  ].filter((item) => item.value > 0);

  return (
    <Card className="flex flex-col text-center">
      <CardHeader className="items-center pb-0">
        <CardTitle>Task Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
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
                          {tasks.total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {/* Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total task count for the project
        </div>
      </CardFooter>
    </Card>
  );
};
