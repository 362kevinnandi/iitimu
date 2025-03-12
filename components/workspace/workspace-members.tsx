"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkspaceMembersProps } from "@/utils/types";
import { MemberCard } from "../members/member-card";
import { MemberDetails } from "../members/member-details";

interface ProjectProps {
  id: string;
  name: string;
}

export const WorkspaceMembers = ({
  members,
  projects,
}: {
  members: WorkspaceMembersProps[];
  projects: ProjectProps[];
}) => {
  const [selectedMember, setSelectedMember] = useState<
    (typeof members)[0] | null
  >(null);

  const handleMemberClick = (member: WorkspaceMembersProps) => {
    setSelectedMember(member);
  };

  return (
    <div className="flex flex-col md:flex-row w-full justify-center bg-background p-3 md:p-6 transition-all duration-300">
      <div className="w-full md:w-1/2 md:pr-6 mb-10 md:mb-0">
        <Card>
          <CardHeader>
            <CardTitle>Workspace Members</CardTitle>
            <CardDescription>
              Manage your workspace members and their access levels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {members?.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                selectedMember={selectedMember?.id || ""}
                onClick={handleMemberClick}
              />
            ))}
          </CardContent>
        </Card>
      </div>
      {selectedMember && (
        <MemberDetails
          key={selectedMember.id}
          selectedMember={selectedMember}
          projects={projects}
          setSelectedMember={setSelectedMember}
        />
      )}
    </div>
  );
};
