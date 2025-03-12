import { format } from "date-fns";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ProjectTaskProps } from "@/types/task";

interface TimelineViewProps {
  tasks: ProjectTaskProps[];
  workspaceId: string;
}

export const TimelineView = ({ tasks, workspaceId }: TimelineViewProps) => {
  const startDate = new Date(
    Math.min(...tasks.map((t) => t.startDate.getTime()))
  );
  const endDate = new Date(Math.max(...tasks.map((t) => t.dueDate.getTime())));

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const dates = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getTaskPosition = (task: ProjectTaskProps) => {
    const start = Math.floor(
      (task.startDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const duration = Math.ceil(
      (task.dueDate.getTime() - task.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return {
      left: `${(start / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    };
  };

  const getTaskColor = (task: ProjectTaskProps) => {
    if (task.status === "COMPLETED") return "bg-emerald-600";
    if (task.status === "IN_PROGRESS") return "bg-yellow-600";
    if (task.status === "BACKLOG") return "bg-pink-600";
    if (task.status === "BLOCKED") return "bg-red-600";
    if (task.status === "IN_REVIEW") return "bg-purple-600";
    if (task.status === "TODO") return "bg-blue-600";
    return "bg-backgroundPrimary/20";
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] p-4">
        <div className="flex border-b mb-4">
          <div className="w-64 flex-shrink-0" />
          {dates.map((date, i) => (
            <div
              key={i}
              className="flex-1 text-sm text-muted-foreground p-2 text-center"
            >
              {format(date, "MMM d")}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="relative h-16 flex items-center">
              <div className="w-48 pr-4 flex-shrink-0 flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={task.assignedTo.image || undefined} />
                    <AvatarFallback>
                      {task.assignedTo.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {task.assignedTo.name?.split(" ")[0]}
                  </span>
                </div>
              </div>

              <div className="flex-1 relative h-8">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link
                        href={`/workspace/${workspaceId}/projects/${task.projectId}/${task.id}`}
                      >
                        <div
                          className={cn(
                            `absolute h-full rounded-full flex items-center px-2 border-none`,
                            getTaskColor(task)
                          )}
                          style={getTaskPosition(task)}
                        >
                          <span className="text-xs truncate text-white">
                            {task.title}
                          </span>
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="bg-background">
                      <div className="text-sm">
                        <p className="font-medium text-foreground">
                          {task.title}
                        </p>
                        <p className="text-muted-foreground">
                          {format(task.startDate, "MMM d")} -{" "}
                          {format(task.dueDate, "MMM d")}
                        </p>
                        <p className="text-muted-foreground">
                          Assigned to: {task.assignedTo.name}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
