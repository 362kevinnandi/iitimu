"use client";

import { DataTable } from "@/components/ui/data-table";
import { File, Project, Task, User } from "@prisma/client";
import { columns, myTaskColumns } from "./columns";

export interface TaskProps extends Task {
  assignedTo: User | null;
  project: Project;
  attachments: File[];
}

export interface MemberProps {
  id: string;
  name: string;
  email: string;
  image: string;
  workspaceId: string;
}

export const ProjectTable = ({ tasks }: { tasks: TaskProps[] }) => (
  <DataTable columns={columns} data={tasks as any} />
);

export const MyTasksTable = ({ tasks }: { tasks: TaskProps[] }) => (
  <DataTable columns={myTaskColumns} data={tasks as unknown as any} />
);
