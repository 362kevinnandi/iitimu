"use client";

import { CalendarDays } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { ProjectAvatar } from "../project/project-avatar";
import Link from "next/link";

interface RecentMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinedAt: string;
}

interface RecentProject {
  id: string;
  name: string;
  createdAt: string;
  tasksCount: number;
}

interface WorkspaceRecentActivitiesProps {
  recentMembers: RecentMember[];
  recentProjects: RecentProject[];
}

export const WorkspaceRecentActivities = ({
  recentMembers,
  recentProjects,
}: WorkspaceRecentActivitiesProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-4 rounded-lg"
              >
                <Avatar className="w-8 h-8 md:w-10 md:h-10 rounded-lg">
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback className="bg-blue-600 text-white rounded-lg">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col md:flex-row items-start justify-between w-full">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm md:text-base font-medium">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {member.email}
                    </p>
                  </div>
                  <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}

            {recentMembers.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent members</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center space-x-4">
                <div className="flex-1 flex gap-2">
                  <Link
                    href={`/workspace/${workspaceId}/projects/${project.id}`}
                    className="flex items-center gap-2"
                  >
                    <ProjectAvatar name={project.name} />
                    <div>
                      <p className="text-sm md:text-base font-medium">
                        {project.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {project.tasksCount} tasks
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}

            {recentProjects.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No recent projects
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
