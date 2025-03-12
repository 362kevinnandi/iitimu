import { requiredUser } from "@/app/data/user/is-user-authenticated";
import { db } from "@/lib/db";
import { isUserWorkspaceMember } from "../user/is-user-workspace-member";

export const getTaskById = async (
  taskId: string,
  workspaceId: string,
  projectId: string
) => {
  try {
    const { user } = await requiredUser();

    const { isUserAMember } = await isUserWorkspaceMember(user.id, workspaceId);

    if (!isUserAMember)
      throw new Error("You are not a member of this workspace");

    const projectAccess = await db.projectAccess.findUnique({
      where: {
        workspaceMemberId_projectId: {
          workspaceMemberId: isUserAMember.id,
          projectId: projectId,
        },
      },
    });

    if (!projectAccess)
      throw new Error("You do not have access to this project");

    const [task, comments] = await Promise.all([
      db.task.findUnique({
        where: { id: taskId },
        include: {
          assignedTo: { select: { id: true, name: true, image: true } },
          attachments: { select: { name: true, type: true, url: true } },
          taskDocuments: {
            orderBy: { createdAt: "desc" },
          },
          project: {
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
            },
          },
          timeLogs: true,
        },
      }),
      db.comment.findMany({
        where: {
          projectId: projectId,
        },
        include: {
          user: { select: { id: true, image: true, name: true } },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);
    const project = {
      ...task?.project,
      members: task?.project?.projectAccess?.map(
        (access) => access.workspaceMember
      ),
    };

    return { task: { ...task, project }, comments };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get task by id",
      status: 500,
    };
  }
};
