"use client";

import { FolderKanban, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCreateProject } from "@/hooks/use-create-project";
import { cn } from "@/lib/utils";
import { ProjectProps, WorkspaceMemberProps } from "@/utils/types";

import { CreateProjectForm } from "../project/create-project-form";
import { ResponsiveDialog } from "../responsive-modal";
import { Button } from "../ui/button";

export const NavProjects = ({
  projects,
  workspaceMembers,
}: {
  projects: ProjectProps[];
  workspaceMembers: WorkspaceMemberProps[];
}) => {
  const { isMobile, setOpenMobile } = useSidebar();
  const { isOpen, open, close } = useCreateProject();
  const pathname = usePathname();

  const handleAddNewProject = () => {
    setOpenMobile(false);
    open();
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="flex  justify-between">
          <span className="text-sm font-semibold text-gray-500 uppercase">
            Projects
          </span>

          <Button
            onClick={handleAddNewProject}
            size={"icon"}
            className="size-5"
          >
            <Plus />
          </Button>
        </SidebarGroupLabel>
        <SidebarMenu>
          {projects?.map((project) => {
            const href = `/workspace/${project.workspaceId}/projects/${project.id}`;
            const isActive = pathname.includes(project.id);

            return (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    isActive &&
                      "bg-backgroundPrimary/10  text-backgroundPrimary"
                  )}
                >
                  <a href={href} onClick={() => setOpenMobile(false)}>
                    <FolderKanban className="mr-2 max-h-4 max-w-4" />
                    <span>{project.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>

      <ResponsiveDialog
        title="Create New Project"
        open={isOpen}
        onOpenChange={close}
      >
        <CreateProjectForm
          onClose={close}
          workspaceMembers={workspaceMembers}
        />
      </ResponsiveDialog>
    </>
  );
};
