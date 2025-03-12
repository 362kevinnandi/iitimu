import { db } from "@/lib/db";
import { $Enums } from "@prisma/client";
import { requiredUser } from "../user/is-user-authenticated";

export const getProjectById = async (projectId: string) => {
  try {
    const { user } = await requiredUser();

    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error("Project not found.");
    }

    const isUserAMember = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: project.workspaceId,
        },
      },
    });

    if (!isUserAMember) {
      throw new Error("Unauthorized access.");
    }

    if (isUserAMember.accessLevel !== $Enums.AccessLevel.OWNER) {
      const projectAccess = await db.projectAccess.findUnique({
        where: {
          workspaceMemberId_projectId: {
            projectId: project.id,

            workspaceMemberId: isUserAMember.id,
          },
          hasAccess: true,
        },
      });

      if (!projectAccess) {
        throw new Error("Unauthorized access.");
      }
    }

    return project;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get project by id",
      status: 500,
    };
  }
};
