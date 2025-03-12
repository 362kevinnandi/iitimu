import { getWorkspaceById } from "@/app/data/workspace/get-workspace";
import { WorkspaceSettingsForm } from "@/components/workspace/workspace-settings-form";

const WorkspaceSettingsPage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) => {
  const workspaceId = (await params).workspaceId;

  const { data } = await getWorkspaceById(workspaceId);

  if (!data) return null;

  return (
    <div>
      <WorkspaceSettingsForm data={data} key={new Date().getTime()} />
    </div>
  );
};

export default WorkspaceSettingsPage;
