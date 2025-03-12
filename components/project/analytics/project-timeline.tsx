import { format } from "date-fns";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { taskStatusVariant } from "@/utils";
import { $Enums, Task } from "@prisma/client";

interface ProjectTimelineProps {
  tasks: {
    items: Task[];
  };
  workspaceId: string;
}

export const ProjectTimeline = ({
  tasks,
  workspaceId,
}: ProjectTimelineProps) => {
  const sortedTasks = [...tasks.items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="space-y-8">
      {sortedTasks.map((task, index) => (
        <div key={task.id} className="relative">
          {index < sortedTasks.length - 1 && (
            <div className="absolute left-2.5 top-8 h-full w-0.5 bg-gray-300 dark:bg-gray-200" />
          )}

          <div className="flex gap-4">
            <div
              className={`h-6 w-6 rounded-full mt-1`}
              style={{
                backgroundColor:
                  taskStatusVariant[task?.status as $Enums.TaskStatus],
              }}
            />

            <Card className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link
                    href={`/workspace/${workspaceId}/projects/${task.projectId}/${task.id}`}
                  >
                    <h4 className="font-medium">{task.title}</h4>
                  </Link>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {task.dueDate &&
                    format(new Date(task.dueDate), "MMM d, yyyy")}
                </div>
              </div>
            </Card>
          </div>
        </div>
      ))}

      {sortedTasks.length === 0 && (
        <p className="text-sm text-muted-foreground">No tasks found</p>
      )}
    </div>
  );
};
