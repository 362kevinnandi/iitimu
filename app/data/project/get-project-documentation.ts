import "server-only";

import { db } from "@/lib/db";
import { requiredUser } from "../user/is-user-authenticated";

export const getProjectDocumentation = async (
  workspaceId: string,
  projectId: string
) => {
  try {
    const { user } = await requiredUser();

    const isUserAMember = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (!isUserAMember) {
      throw new Error("Unauthorized access.");
    }

    const projectAccess = await db.projectAccess.findUnique({
      where: {
        workspaceMemberId_projectId: {
          projectId: projectId,
          workspaceMemberId: isUserAMember.id,
        },
      },
      include: {
        project: { select: { name: true, id: true } },
      },
    });

    if (!projectAccess) {
      throw new Error("Unauthorized access.");
    }

    const doc = await db.projectDocument.findUnique({
      where: { projectId: projectId as string },
    });

    return { doc, project: projectAccess?.project };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get project documentation",
      status: 500,
    };
  }
};
