import { db } from "@/lib/db";
import { $Enums, Prisma } from "@prisma/client";
import { requiredUser } from "../user/is-user-authenticated";

export const getWorkspaceProjectsByWorkspaceId = async (
  workspaceId: string
) => {
  try {
    const { user } = await requiredUser();

    const isUserAMember = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

    if (!isUserAMember) {
      throw new Error("Unauthorized access.");
    }

    const query: Prisma.ProjectWhereInput =
      isUserAMember.accessLevel === $Enums.AccessLevel.OWNER
        ? { workspaceId }
        : {
            projectAccess: {
              some: {
                hasAccess: true,
                workspaceMember: { userId: user.id, workspaceId },
              },
            },
          };

    const [projects, workspaceMembers] = await Promise.all([
      db.project.findMany({
        where: query,
        select: {
          name: true,
          id: true,
          workspaceId: true,
          description: true,
        },
      }),
      db.workspaceMember.findMany({
        where: { workspaceId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
    ]);

    return { projects, workspaceMembers };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get workspace projects",
      status: 500,
    };
  }
};
