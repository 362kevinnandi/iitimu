import { redirect } from "next/navigation";

import { getTaskById } from "@/app/data/task/get-task";
import { TaskTextEditor } from "@/components/richTextEditors/task-text-editor";
import { TaskAttachments } from "@/components/task/task-attachments";
import { TaskComments } from "@/components/task/task-comments";
import TaskDetails, { TaskDetailsProps } from "@/components/task/task-details";
import { TaskDocument } from "@prisma/client";

interface PageProps {
  params: Promise<{
    taskId: string;
    workspaceId: string;
    projectId: string;
  }>;
}

const TaskDetailsPage = async ({ params }: PageProps) => {
  const { taskId, workspaceId, projectId } = await params;

  const { task, comments } = await getTaskById(taskId, workspaceId, projectId);
  if (!task) redirect("/not-found");

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-3 md:px-6 pb-6">
      <div className="flex-1">
        <TaskDetails task={task as unknown as TaskDetailsProps["task"]} />

        <div className="mt-4">
          <TaskTextEditor
            taskId={taskId}
            taskDocuments={task?.taskDocuments as unknown as TaskDocument[]}
          />
        </div>
      </div>

      <div className="w-full lg:w-[400px]">
        <TaskComments taskId={task?.id as string} comments={comments as any} />
        <TaskAttachments attachments={task?.attachments || []} />
      </div>
    </div>
  );
};

export default TaskDetailsPage;
