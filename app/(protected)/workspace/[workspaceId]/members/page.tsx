import { getWorkspaceMembers } from "@/app/data/workspace/get-workspace-members";
import { WorkspaceMembers } from "@/components/workspace/workspace-members";
import { WorkspaceMembersProps } from "@/utils/types";

const WorkspaceMembersPage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) => {
  const workspaceId = (await params).workspaceId;

  const { workspaceMembers, workspaceProjects } =
    await getWorkspaceMembers(workspaceId);

  return (
    <div className="w-full flex  justify-center">
      <WorkspaceMembers
        members={workspaceMembers as WorkspaceMembersProps[]}
        projects={workspaceProjects!}
      />
    </div>
  );
};

export default WorkspaceMembersPage;
