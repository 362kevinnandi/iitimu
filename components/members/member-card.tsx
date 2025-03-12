import { WorkspaceMember } from "@prisma/client";
import { Badge } from "../ui/badge";
import { ProfileAvatar } from "../user-avatar";

interface MembersProps extends WorkspaceMember {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  projectAccess: {
    id: string;
    hasAccess: boolean;
    projectId: string;
  }[];
}

interface MemberCardProps {
  member: MembersProps;
  selectedMember: string;
  onClick: (member: MembersProps) => void;
}

export const MemberCard = ({
  member,
  selectedMember,
  onClick,
}: MemberCardProps) => {
  return (
    <div
      key={member.id}
      className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:dark:bg-gray-800 ${
        selectedMember === member.id ? "bg-gray-100 dark:bg-gray-900" : ""
      }`}
      onClick={() => onClick(member)}
    >
      <ProfileAvatar url={member.user.image} name={member.user.name} />
      <div>
        <p className="font-semibold">{member.user.name}</p>
        <div className="text-sm text-gray-500">
          <Badge variant={member.accessLevel}>{member.accessLevel}</Badge>
          {" | "} {member.projectAccess.length} project(s)
        </div>
      </div>
    </div>
  );
};
