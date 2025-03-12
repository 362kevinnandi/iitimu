"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useURLPathName } from "@/hooks/use-pathname";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { WorkspacesProps } from "@/utils/types";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";

export const WorkspaceSwitcher = ({
  workspaces,
}: {
  workspaces: WorkspacesProps[];
}) => {
  const path = useURLPathName();
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const onSelect = (id: string) => {
    setSelectedWorkspace(
      workspaces?.find((workspace) => workspace?.workspaceId === id!)
    );
    router.push(`/workspace/${id}`);
  };

  const [selectedWorkspace, setSelectedWorkspace] = React.useState<
    WorkspacesProps | undefined
  >(undefined);

  React.useEffect(() => {
    if (workspaceId && workspaces) {
      setSelectedWorkspace(
        workspaces?.find((workspace) => workspace?.workspaceId === workspaceId)
      );
    }
  }, [workspaceId, workspaces]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <WorkspaceAvatar
                name={selectedWorkspace?.workspace.name || "W"}
              />
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">
                  {selectedWorkspace?.workspace.name}
                </span>
                {/* <span className="">{selectedWorkspace?.workspace.name}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {workspaces?.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onSelect={() => onSelect(workspace.workspaceId)}
              >
                <div className="flex flex-row items-center gap-2">
                  <WorkspaceAvatar name={workspace?.workspace.name} />

                  <p>{workspace.workspace.name}</p>
                </div>

                {workspace.workspaceId === workspaceId && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
