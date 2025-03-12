import { File, Plus, Settings } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectMembersProps } from "@/utils/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CreateTaskDialog } from "./create-task-dialog";
import { ProjectAvatar } from "./project-avatar";

export const ProjectHeader = ({
  project,
  ownerQuota,
}: {
  project: ProjectMembersProps;
  ownerQuota: {
    plan: string;
    isValid: boolean;
  };
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex gap-2">
          <ProjectAvatar name={project.name} />
          <div>
            <h1 className="text-xl 2xl:text-2xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="test-xs lg:text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-3 md:mt-0  gap-3">
          <CreateTaskDialog project={project} ownerQuota={ownerQuota} />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center focus-visible:outline-none">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/project/${project.id}/settings`} className="flex">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`/workspace/${project.workspaceId}/projects/${project.id}/docs`}
                  className="flex"
                >
                  <File className="h-4 w-4 mr-2" />
                  Documentation
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <h3 className="text-sm font-medium">Team Members</h3>
          <div className="flex flex-wrap -space-x-2">
            {project.members?.map((member) => (
              <Avatar
                key={member.id}
                className="size-9 2xl:size-10 border-2 border-background shadow"
              >
                <AvatarImage src={member?.user?.image || undefined} />
                <AvatarFallback className="text-sm 2xl:text-base">
                  {member?.user?.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
