import { getTasksByProjectId } from "@/app/data/task/get-tasks";
import { ProjectTable, TaskProps } from "./project-table";

interface DataProps {
  projectId: string;
}
export const ProjectTableContainer = async ({ projectId }: DataProps) => {
  const { tasks } = await getTasksByProjectId(projectId);

  return (
    <div className="p-4">
      <ProjectTable tasks={tasks as unknown as TaskProps[]} />
    </div>
  );
};
