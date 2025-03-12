import { db } from "@/lib/db";
import { requiredUser } from "@/app/data/user/is-user-authenticated";

export const getTasksByProjectId = async (projectId: string) => {
  try {
    await requiredUser();

    const tasks = await db.task.findMany({
      where: {
        projectId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            workspaceId: true,
          },
        },
        attachments: { select: { name: true, type: true, url: true } },
      },
    });

    return { tasks };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get tasks by project id",
      status: 500,
    };
  }
};
