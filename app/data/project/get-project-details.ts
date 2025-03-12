import { db } from "@/lib/db";
import { SubscriptionStatus, TaskStatus } from "@prisma/client";

import { requiredUser } from "../user/is-user-authenticated";

export const getProjectDetails = async (
  workspaceId: string,
  projectId: string
) => {
  try {
    const { user } = await requiredUser();

    const [isUserAMember, totalWorkspaceMembers, workspaceOwner] =
      await Promise.all([
        db.workspaceMember.findUnique({
          where: {
            userId_workspaceId: {
              userId: user.id,
              workspaceId,
            },
          },
        }),
        db.workspaceMember.count({
          where: { workspaceId },
        }),
        db.workspace.findUnique({
          where: { id: workspaceId },
          select: {
            ownerId: true,
          },
        }),
      ]);

    if (!isUserAMember) {
      throw new Error("Unauthorized access.");
    }

    const [project, comments, ownerQuota] = await Promise.all([
      db.project.findUnique({
        where: { id: projectId },
        include: {
          projectAccess: {
            include: {
              workspaceMember: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
          tasks: {
            include: {
              assignedTo: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              project: {
                select: { name: true, id: true },
              },
              attachments: { select: { id: true } },
            },
          },

          activities: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 50,
          },
        },
      }),
      db.comment.findMany({
        where: { projectId },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.subscription.findUnique({
        where: { userId: workspaceOwner?.ownerId },
      }),
    ]);

    if (!project) {
      throw new Error("Project not found.");
    }

    const tasks = {
      total: project.tasks.length,
      completed:
        project.tasks.filter((task) => task.status === TaskStatus.COMPLETED)
          .length || 0,
      inProgress:
        project.tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS)
          .length || 0,
      overdue:
        project.tasks.filter(
          (task) =>
            task.status !== TaskStatus.COMPLETED &&
            task.dueDate &&
            new Date(task.dueDate) < new Date()
        ).length || 0,

      items: project.tasks,
    };

    return {
      project: {
        ...project,
        members: project.projectAccess.map((access) => access.workspaceMember),
      },
      tasks,
      activities: project.activities,
      totalWorkspaceMembers,
      comments,
      ownerQuota: {
        plan: ownerQuota?.plan,
        isValid: ownerQuota?.status === SubscriptionStatus.ACTIVE,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get project details",
      status: 500,
    };
  }
};
