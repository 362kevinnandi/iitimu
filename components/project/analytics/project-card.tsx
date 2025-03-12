import { DraggableProvided } from "@hello-pangea/dnd";

import { Card } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/user-avatar";
import { ProjectTaskProps } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { ProjectAvatar } from "../project-avatar";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useProjectId } from "@/hooks/use-project-id";

interface DataProps {
  ref: (element?: HTMLElement | null) => void;
  task: ProjectTaskProps;
  provided: DraggableProvided;
}

export const ProjectCard = ({ task, provided }: DataProps) => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();

  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="mb-2 p-3 bg-white dark:bg-gray-900 shadow-sm"
    >
      <Link href={`/workspace/${workspaceId}/projects/${projectId}/${task.id}`}>
        <h3 className="font-medium">{task.title}</h3>
      </Link>
      {task.description && (
        <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
          {task.description}
        </p>
      )}
      <div className="flex items-center gap-2 justify-between mt-2">
        <div className="flex items-center gap-2">
          <ProjectAvatar
            name={task.project.name}
            className="!size-5 !text-xs !rounded-sm"
          />
          <p className="text-sm text-muted-foreground">{task.project.name}</p>
        </div>
        <Badge variant={task.priority}>{task?.priority}</Badge>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <ProfileAvatar
          url={task?.assignedTo.image || undefined}
          name={task.assignedTo.name}
          className="text-[14px] !size-5"
        />
        <p className="text-sm text-muted-foreground">{task.assignedTo.name}</p>
      </div>
    </Card>
  );
};
