import { $Enums, AccessLevel, WorkspaceMember } from "@prisma/client";

export interface WorkspaceMembersProps extends WorkspaceMember {
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

export interface ProjectMembersProps {
  id: string;
  name: string;
  description?: string | null;
  workspaceId: string;
  members: {
    id: string;
    userId: string;
    workspaceId: string;
    accessLevel: AccessLevel;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
  }[];
}

export interface ProjectProps {
  name: string;
  id: string;
  workspaceId: string;
}

export interface WorkspaceMemberProps {
  userId: string;
  accessLevel: string;
  user: {
    name: string;
  };
}

export interface WorkspacesProps {
  id: string;
  createdAt: Date;
  userId: string;
  workspaceId: string;
  accessLevel: $Enums.AccessLevel;
  workspace: {
    name: string;
  };
}

export interface ProductivityMetricsProps {
  dailyData: {
    date: string;
    timeSpent: number;
    tasksCompleted: number;
    efficiency: number;
    focusScore: number;
  }[];
  weeklyData: {
    date: string;
    timeSpent: number;
    tasksCompleted: number;
    efficiency: number;
    focusScore: number;
  }[];
  monthlyData: {
    date: string;
    timeSpent: number;
    tasksCompleted: number;
    efficiency: number;
    focusScore: number;
  }[];
  totalTimeSpent: number;
  totalTasksCompleted: number;
  averageEfficiency: number;
  averageFocusScore: number;
}
