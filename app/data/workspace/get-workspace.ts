import { requiredUser } from "@/app/data/user/is-user-authenticated";
import { db } from "@/lib/db";
import { isUserWorkspaceMember } from "../user/is-user-workspace-member";

export const getWorkspaceById = async (workspaceId: string) => {
  try {
    const { user } = await requiredUser();

    await isUserWorkspaceMember(user.id, workspaceId);

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          select: { userId: true, accessLevel: true },
        },
      },
    });

    return { data: workspace };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get workspace by id",
      status: 500,
    };
  }
};
