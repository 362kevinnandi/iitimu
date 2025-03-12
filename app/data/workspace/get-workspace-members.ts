import { requiredUser } from "@/app/data/user/is-user-authenticated";
import { db } from "@/lib/db";
import { isUserWorkspaceMember } from "../user/is-user-workspace-member";

export const getWorkspaceMembers = async (workspaceId: string) => {
  try {
    const { user } = await requiredUser();

    await isUserWorkspaceMember(user.id, workspaceId);

    const [workspaceMembers, workspaceProjects] = await Promise.all([
      db.workspaceMember.findMany({
        where: { workspaceId },
        include: {
          user: { select: { id: true, email: true, name: true, image: true } },
          projectAccess: {
            select: { id: true, hasAccess: true, projectId: true },
          },
        },
      }),
      db.project.findMany({
        where: { workspaceId },
        select: { id: true, name: true },
      }),
    ]);

    return { workspaceMembers, workspaceProjects };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get workspace members",
      status: 500,
    };
  }
};
