import { db } from "@/lib/db";
import { WorkspaceMember } from "@prisma/client";

export const isUserWorkspaceMember = async (
  userId: string,
  workspaceId: string
) => {
  try {
    const isUserAMember = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!isUserAMember) {
      throw new Error("You're not a member of this workspace.");
    }

    return { isUserAMember };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to check if user is a workspace member",
      status: 500,
    };
  }
};
