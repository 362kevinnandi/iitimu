import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectMembersProps } from "@/utils/types";
import { Task, TimeLog, User } from "@prisma/client";
import { format } from "date-fns";
import { EditTaskDialog } from "../project/edit-task-dialog ";
import { ProjectAvatar } from "../project/project-avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ProfileAvatar } from "../user-avatar";
import { TimeLogChart } from "./time-log-chart";
import { TimeTracker } from "./time-tracker";

export interface TaskDetailsProps {
  task: Task & {
    assignedTo: User;
    project: ProjectMembersProps;
    timeLogs: TimeLog[];
  };
}

const TaskDetails = async ({ task }: TaskDetailsProps) => {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
            <div className="flex items-center gap-2">
              <ProjectAvatar name={task.project.name} />
              <p className="text-base text-muted-foreground">
                {task.project.name}
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col justify-end items-end gap-2">
            <EditTaskDialog
              key={new Date().getTime()}
              task={task}
              project={task.project}
            />

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Assigned to:
              </span>
              <ProfileAvatar
                name={task.assignedTo.name}
                url={task.assignedTo.image || undefined}
                size="sm"
              />
              <span className="text-sm font-medium">
                {task.assignedTo.name}
              </span>
            </div>
          </div>
        </CardHeader>
        <Separator className="my-3" />
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>

            {task.description ? (
              <p className="text-muted-foreground">{task.description}</p>
            ) : (
              <p className="text-muted-foreground">No description</p>
            )}
          </div>

          <Separator className="my-3" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={task.status}>{task.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">
                  {task.dueDate
                    ? format(task.dueDate, "MMM d, yyyy")
                    : "No due date"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <Badge variant={task.priority}>{task.priority}</Badge>
              </div>
            </div>
          </div>
        </CardContent>

        <Separator className="my-3" />

        <TimeLogChart timeLogs={task?.timeLogs} />
      </Card>

      <TimeTracker taskId={task.id} />
    </>
  );
};

export default TaskDetails;
