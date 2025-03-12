"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, CheckCircle2, Folder, ListTodo, Users } from "lucide-react";

interface WorkspaceStatsProps {
  totalProjects: number;
  totalTasks: number;
  assignedTasks: number;
  completedTasks: number;
  totalMembers: number;
}

export function WorkspaceStats({
  totalProjects,
  totalTasks,
  assignedTasks,
  completedTasks,
  totalMembers,
}: WorkspaceStatsProps) {
  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: Folder,
      color: "text-blue-600",
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
      color: "text-orange-600",
    },
    {
      title: "My Tasks",
      value: assignedTasks,
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Team Members",
      value: totalMembers,
      icon: Users,
      color: "text-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
