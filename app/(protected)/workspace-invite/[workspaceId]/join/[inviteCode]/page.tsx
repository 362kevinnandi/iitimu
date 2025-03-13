import { redirect } from "next/navigation";

import { getWorkspaceInfoByInviteCode } from "@/app/data/workspace/get-workspace-info-by-invitecode";
import { getUserWorkspaces } from "@/app/data/workspace/get-workspaces";
import { JoinWorkspace } from "@/components/workspace/join-workspace";

const JoinWorkspacePage = async ({
  params,
}: {
  params: Promise<{ inviteCode: string }>;
}) => {
  const inviteCode = (await params).inviteCode;

  if (!inviteCode) {
    throw new Error("Invite code is required");
  }

  const { data: userInfo } = await getUserWorkspaces();

  if (!userInfo) {
    redirect("/onboarding");
  }

  const { data } = await getWorkspaceInfoByInviteCode(inviteCode);

  if (!data) return null;

  const workspaceInfo = {
    name: data?.name,
    description: data?.description || "",
    inviteCode: data?.inviteCode,
    workspaceId: data?.id,
  };

  return (
    <div>
      <JoinWorkspace workspace={workspaceInfo} />
    </div>
  );
};

export default JoinWorkspacePage;
