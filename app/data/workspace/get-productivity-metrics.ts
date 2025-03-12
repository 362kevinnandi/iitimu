import { addDays, endOfDay, format, startOfDay, subDays } from "date-fns";

import { db } from "@/lib/db";

export const getProductivityMetrics = async (workspaceId: string) => {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  // Get all tasks and their time logs within the last 30 days through workspace projects
  const tasksWithLogs = await db.task.findMany({
    where: {
      project: {
        workspaceId: workspaceId,
      },
      status: "COMPLETED",
      updatedAt: {
        gte: thirtyDaysAgo,
      },
    },
    include: {
      timeLogs: true,
      project: {
        select: {
          workspaceId: true,
        },
      },
    },
  });

  // Calculate daily metrics
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(now, i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const dayTasks = tasksWithLogs.filter(
      (task) => task.updatedAt >= dayStart && task.updatedAt <= dayEnd
    );

    const timeSpent = dayTasks.reduce(
      (total, task) =>
        total +
        (task.timeLogs?.reduce((sum, log) => sum + (log.duration ?? 0), 0) ??
          0),
      0
    );

    return {
      date: format(dayStart, "MMM d"), //dayStart.toISOString().split("T")[0],
      timeSpent,
      tasksCompleted: dayTasks.length,
      efficiency:
        dayTasks.length > 0 && timeSpent > 0
          ? Math.round((dayTasks.length / (timeSpent / 60)) * 100)
          : 0,
      focusScore: Math.min(100, Math.round((timeSpent / (8 * 60)) * 100)), // Assuming 8 hours is ideal
    };
  }).reverse();

  // Calculate weekly data
  const weeklyData = Array.from({ length: 4 }, (_, i) => {
    const weekStart = subDays(now, i * 7);
    const weekEnd = addDays(weekStart, 6);

    const weekTasks = tasksWithLogs.filter(
      (task) =>
        format(task.updatedAt, "yyyy-MM-dd") >=
          format(weekStart, "yyyy-MM-dd") &&
        format(task.updatedAt, "yyyy-MM-dd") <= format(weekEnd, "yyyy-MM-dd")
    );

    const timeSpent = weekTasks.reduce(
      (total, task) =>
        total +
        (task.timeLogs?.reduce((sum, log) => sum + (log.duration ?? 0), 0) ??
          0),
      0
    );

    return {
      date: `Week ${4 - i}`,
      timeSpent,
      tasksCompleted: weekTasks.length,
      efficiency:
        weekTasks.length > 0 && timeSpent > 0
          ? Math.round((weekTasks.length / (timeSpent / 60)) * 100)
          : 0,
      focusScore: Math.min(100, Math.round((timeSpent / (40 * 60)) * 100)), // Assuming 40 hours is ideal
    };
  }).reverse();

  // Calculate total metrics
  const totalTimeSpent = tasksWithLogs.reduce(
    (total, task) =>
      total +
      (task.timeLogs?.reduce((sum, log) => sum + (log.duration ?? 0), 0) ?? 0),
    0
  );

  return {
    dailyData,
    weeklyData,
    monthlyData: weeklyData, // For simplicity, using weekly data for monthly view
    totalTimeSpent,
    totalTasksCompleted: tasksWithLogs.length,
    averageEfficiency:
      tasksWithLogs.length > 0 && totalTimeSpent > 0
        ? Math.round((tasksWithLogs.length / (totalTimeSpent / 60)) * 100)
        : 0,
    averageFocusScore: Math.min(
      100,
      Math.round((totalTimeSpent / (160 * 60)) * 100)
    ), // Assuming 160 hours is ideal for a month
  };
};
