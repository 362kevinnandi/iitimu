import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { getUserWorkspaces } from "@/app/data/workspace/get-workspaces";
import { Navbar } from "@/components/navbar";
import { AppSidebarContainer } from "@/components/sidebar/app-sidebar-container";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface Props {
  params: Promise<{ workspaceId: string }>;
  children: ReactNode;
}
const WorkspaceLayout = async ({ children, params }: Props) => {
  const { data, totalUnreadNotifications } = await getUserWorkspaces();

  if (data?.onboardingCompleted && !data?.workspaces) {
    redirect("/create-workspace");
  } else if (!data?.onboardingCompleted) {
    redirect("/onboarding");
  }

  const workspaceId = (await params).workspaceId;

  return (
    <SidebarProvider>
      <div className="w-full flex bg-background h-screen">
        <AppSidebarContainer data={data!} workspaceId={workspaceId} />
        <main className="w-full overflow-y-auto min-h-screen">
          <div className="flex items-start">
            <SidebarTrigger className="pt-3" />
            <Navbar
              id={data?.id as string}
              name={data?.name as string}
              email={data?.email as string}
              image={data?.image as string}
              totalUnreadNotifications={totalUnreadNotifications}
            />
          </div>

          <div className="p-0 md:p-4 pt-2">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WorkspaceLayout;
