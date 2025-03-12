import { Task, TaskStatus } from "@prisma/client";

export interface ProjectTaskProps extends Task {
  assignedTo: {
    id: string;
    name: string;
    image?: string;
  };
  project: { id: string; name: string };
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: ProjectTaskProps[];
}
