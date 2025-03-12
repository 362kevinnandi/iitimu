import { db } from "@/lib/db";
import { requiredUser } from "@/app/data/user/is-user-authenticated";
import { TaskStatus, WorkspaceMember } from "@prisma/client";
import { isUserWorkspaceMember } from "../user/is-user-workspace-member";

export const getWorkspaceStatistics = async (workspaceId: string) => {
  try {
    const { user } = await requiredUser();

    const { isUserAMember } = await isUserWorkspaceMember(user.id, workspaceId);

    if (!isUserAMember) {
      throw new Error("You're not a member of this workspace.");
    }

    const stats = await db.workspace.findFirst({
      where: { id: workspaceId },
      include: {
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
        projects: {
          include: {
            tasks: {
              where: {
                assignedToId: user.id,
              },
            },
          },
        },
      },
    });

    const totalProjects = stats?._count.projects ?? 0;
    const totalMembers = stats?._count.members ?? 0;

    const totalTasks =
      stats?.projects.reduce((acc, project) => acc + project.tasks.length, 0) ??
      0;
    const assignedTasks =
      stats?.projects.reduce(
        (acc, project) =>
          acc +
          project.tasks.filter((task) => task.assignedToId === user.id).length,
        0
      ) ?? 0;

    const completedTasks =
      stats?.projects.reduce(
        (acc, project) =>
          acc +
          project.tasks.filter((task) => task.status === "COMPLETED").length,
        0
      ) ?? 0;

    const tasksByStatus: Record<TaskStatus, number> = {
      TODO: 0,
      IN_PROGRESS: 0,
      BACKLOG: 0,
      COMPLETED: 0,
      BLOCKED: 0,
      IN_REVIEW: 0,
    };

    stats?.projects.forEach((project) => {
      project.tasks.forEach((task) => {
        tasksByStatus[task.status]++;
      });
    });
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentMembers, recentProjects, taskTrend] = await Promise.all([
      db.workspaceMember.findMany({
        where: { workspaceId: workspaceId },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.project.findMany({
        where: {
          workspaceId: workspaceId,
          projectAccess: {
            some: {
              workspaceMemberId: isUserAMember?.id,
            },
          },
        },
        include: {
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.task.findMany({
        where: {
          project: {
            workspaceId: workspaceId,
          },
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const taskTrendGroup = Object.entries(
      taskTrend.reduce(
        (acc, task) => {
          const date = task.createdAt.toISOString().split("T")[0];

          if (!acc[date]) {
            acc[date] = 0;
          }

          acc[date] += 1;
          return acc;
        },
        {} as Record<string, number>
      )
    ).map(([date, count]) => ({ date, count }));

    return {
      totalProjects,
      totalMembers,
      totalTasks,
      assignedTasks,
      completedTasks,
      tasksByStatus,
      recentMembers,
      recentProjects,
      tasksTrend: taskTrendGroup,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get workspace statistics",
      status: 500,
    };
  }
};
