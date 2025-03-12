import { $Enums, User } from "@prisma/client";
import { AppSidebar } from "./app-sidebar";
import { getWorkspaceProjectsByWorkspaceId } from "@/app/data/project/get-workspace-project";
import { getUserById } from "@/app/data/user/get-user";

interface DataProps extends User {
  workspaces: {
    id: string;
    createdAt: Date;
    userId: string;
    workspaceId: string;
    accessLevel: $Enums.AccessLevel;
    workspace: {
      name: string;
    };
  }[];
}

export const AppSidebarContainer = async ({
  data,
  workspaceId,
}: {
  data: DataProps;
  workspaceId: string;
}) => {
  const { projects, workspaceMembers } =
    await getWorkspaceProjectsByWorkspaceId(workspaceId);
  const user = await getUserById();

  return (
    <AppSidebar
      data={data!}
      projects={projects!}
      workspaceMembers={workspaceMembers!}
      user={user as User}
    />
  );
};
