import Link from "next/link";

import { getProjectDetails } from "@/app/data/project/get-project-details";
import { getProjectProductivityMetrics } from "@/app/data/project/get-project-productivity-metrics";
import { CalendarView } from "@/components/project/calendar-view";
import { ProjectDashboard } from "@/components/project/dashboard";
import { ProjectKanban } from "@/components/project/project-kanban";
import { ProjectTableContainer } from "@/components/project/table/table-container";
import { TimelineView } from "@/components/project/timeline-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectTaskProps } from "@/types/task";
import { ProjectMembersProps } from "@/utils/types";

interface ProjectPageProps {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ProjectPage = async (props: ProjectPageProps) => {
  const { workspaceId, projectId } = await props.params;
  const searchParams = await props.searchParams;

  const [
    { project, tasks, activities, totalWorkspaceMembers, comments, ownerQuota },
    productivityMetrics,
  ] = await Promise.all([
    getProjectDetails(workspaceId, projectId),
    getProjectProductivityMetrics(projectId),
  ]);

  return (
    <div className="flex flex-col gap-6 px-3 pb-5">
      <Tabs
        defaultValue={(searchParams.view as string) || "dashboard"}
        className="w-full"
      >
        <TabsList className="mb-4">
          <Link href="?view=dashboard">
            <TabsTrigger value="dashboard" className="px-1.5 md:px-3">
              Dashboard
            </TabsTrigger>
          </Link>
          <TabsTrigger value="table" className="px-1.5 md:px-3">
            <Link href="?view=table">Table</Link>
          </TabsTrigger>
          <TabsTrigger value="kanban" className="px-1.5 md:px-3">
            <Link href="?view=kanban">Kanban</Link>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="px-1.5 md:px-3">
            <Link href="?view=calendar">Calendar</Link>
          </TabsTrigger>

          <TabsTrigger value="timeline" className="px-1.5 md:px-3">
            <Link href="?view=timeline">Timeline</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ProjectDashboard
            project={project as unknown as ProjectMembersProps}
            tasks={tasks!}
            activities={activities!}
            totalWorkspaceMembers={totalWorkspaceMembers!}
            ownerQuota={ownerQuota as any}
            comments={comments as any}
            productivityMetrics={productivityMetrics}
          />
        </TabsContent>

        <TabsContent value="table">
          <ProjectTableContainer projectId={projectId} />
        </TabsContent>

        <TabsContent value="kanban">
          {tasks?.items && tasks?.items?.length > 0 ? (
            <ProjectKanban
              initialTasks={tasks?.items as unknown as ProjectTaskProps[]}
            />
          ) : (
            <div className="flex items-center justify-center h-full mt-10">
              <p className="text-sm text-muted-foreground">No tasks found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarView
            tasks={project?.tasks as unknown as ProjectTaskProps[]}
          />
        </TabsContent>

        <TabsContent value="timeline">
          <TimelineView
            tasks={project?.tasks as unknown as ProjectTaskProps[]}
            workspaceId={workspaceId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectPage;
