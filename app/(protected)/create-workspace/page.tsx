import { redirect } from "next/navigation";

import { getUserWorkspaces } from "@/app/data/workspace/get-workspaces";
import { CreateWorkspaceForm } from "@/components/workspace/workspace-form";

const CreateWorkspace = async () => {
  const { data } = await getUserWorkspaces();

  if (!data?.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-background p-3">
      <CreateWorkspaceForm />
    </div>
  );
};

export default CreateWorkspace;
