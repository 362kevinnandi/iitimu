import { requiredUser } from "@/app/data/user/is-user-authenticated";
import { db } from "@/lib/db";

export const getWorkspaceInfoByInviteCode = async (inviteCode: string) => {
  try {
    await requiredUser();

    const workspace = await db.workspace.findUnique({
      where: { inviteCode },
    });

    if (!workspace) {
      throw new Error("Workspace not found.");
    }

    return { data: workspace };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get workspace info by invite code",
      status: 500,
    };
  }
};
