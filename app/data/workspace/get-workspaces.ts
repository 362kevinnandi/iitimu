import { requiredUser } from "@/app/data/user/is-user-authenticated";
import { db } from "@/lib/db";

export const getUserWorkspaces = async () => {
  try {
    const { user } = await requiredUser();

    const [workspaces, totalUnreadNotifications] = await Promise.all([
      db.user.findUnique({
        where: { id: user.id },
        include: {
          workspaces: {
            select: {
              id: true,
              userId: true,
              workspaceId: true,
              accessLevel: true,
              createdAt: true,
              workspace: { select: { name: true } },
            },
          },
        },
      }),
      db.notification.count({
        where: {
          userId: user.id,
          read: false,
        },
      }),
    ]);

    if (!workspaces) {
      return { data: null };
    }

    return { data: workspaces, totalUnreadNotifications };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get user workspaces",
      status: 500,
    };
  }
};
