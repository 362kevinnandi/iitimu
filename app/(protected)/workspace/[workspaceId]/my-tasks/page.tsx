import { getMyTasks } from "@/app/data/task/get-my-tasks";
import {
  MyTasksTable,
  TaskProps,
} from "@/components/project/table/project-table";

const MyTasksPage = async () => {
  const tasks = await getMyTasks();

  return (
    <div className="p-4">
      <MyTasksTable tasks={tasks as unknown as TaskProps[]} />
    </div>
  );
};

export default MyTasksPage;
