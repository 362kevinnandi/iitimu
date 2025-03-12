import { requiredUser } from "@/app/data/user/is-user-authenticated";
import { db } from "@/lib/db";

export const getMyTasks = async () => {
  try {
    const { user } = await requiredUser();

    const tasks = await db.task.findMany({
      where: {
        assignedToId: user.id,
      },
      include: {
        project: { select: { id: true, name: true, workspaceId: true } },
        attachments: { select: { id: true } },
      },
    });

    return tasks;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get my tasks",
      status: 500,
    };
  }
};
