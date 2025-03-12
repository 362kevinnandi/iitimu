"use client";

import { Plus, Wrench } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ProjectProps, WorkspaceMemberProps } from "@/utils/types";
import { $Enums, User } from "@prisma/client";

import { NavMain } from "../navbar-main";
import { Button } from "../ui/button";
import { NavProjects } from "./nav-project";
import { NavUser } from "./nav-user";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { DialogTitle } from "@radix-ui/react-dialog";
import { SheetTitle } from "../ui/sheet";
import { Avatar, AvatarImage } from "../ui/avatar";

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

export const AppSidebar = ({
  data,
  projects,
  workspaceMembers,
  user,
}: {
  data: DataProps;
  projects: ProjectProps[];
  workspaceMembers: WorkspaceMemberProps[];
  user: User;
}) => {
  ``;
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-background">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="/cloud.svg" />
          </Avatar>
          <SidebarGroupLabel>
            <span className="ml-2 text-xl font-bold">You</span>
            <span className="text-backgroundPrimary text-xl font-bold">
              Name
            </span>
          </SidebarGroupLabel>
        </div>
        <div className="flex  justify-between mb-0">
          <SidebarGroupLabel className="mb-2 text-sm font-semibold text-gray-500 uppercase">
            Workspace
          </SidebarGroupLabel>

          <Button size={"icon"} className="size-5" asChild>
            <Link href={"/create-workspace"}>
              <Plus />
            </Link>
          </Button>
        </div>
        <WorkspaceSwitcher workspaces={data.workspaces} />
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <NavMain />
        <NavProjects projects={projects} workspaceMembers={workspaceMembers} />
      </SidebarContent>

      <SidebarFooter className="bg-background">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
