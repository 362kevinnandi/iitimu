import {
  Activity,
  ActivityFeed,
  CircleProgress,
  ProjectTimeline,
  TaskDistributionChart,
} from "@/components/project/analytics";
import { ProjectHeader } from "@/components/project/project-header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductivityMetricsProps, ProjectMembersProps } from "@/utils/types";
import { Task } from "@prisma/client";
import { CommentList, CommentProps } from "../task/comment-list";
import { ProductivityTracker } from "../shared/productivity-tracker";

interface ProjectDashboardProps {
  project: ProjectMembersProps;
  tasks: {
    completed: number;
    inProgress: number;
    overdue: number;
    total: number;
    items: Task[];
  };
  activities: Activity[];
  totalWorkspaceMembers: number;
  comments: CommentProps[];
  ownerQuota: {
    plan: string;
    isValid: boolean;
  };
  productivityMetrics: ProductivityMetricsProps;
}

export const ProjectDashboard = ({
  project,
  tasks,
  activities,
  totalWorkspaceMembers,
  comments,
  ownerQuota,
  productivityMetrics,
}: ProjectDashboardProps) => {
  return (
    <div className="flex flex-col gap-6 px-2 md:px-4 2xl:px-6 py-0">
      <ProjectHeader
        project={project as unknown as ProjectMembersProps}
        ownerQuota={ownerQuota}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <CircleProgress
            title="Tasks Completed"
            value={(tasks.completed / tasks.total) * 100}
            subtitle={`${tasks.completed}/${tasks.total} tasks`}
            variant="success"
          />
        </Card>

        <Card className="p-4">
          <CircleProgress
            title="In Progress"
            value={(tasks.inProgress / tasks.total) * 100}
            subtitle={`${tasks.inProgress} tasks ongoing`}
            variant="inProgress"
          />
        </Card>
        <Card className="p-4">
          <CircleProgress
            title="Overdue"
            value={(tasks.overdue / tasks.total) * 100}
            subtitle={`${tasks.overdue} tasks overdue`}
            variant="warning"
          />
        </Card>
        <Card className="p-4">
          <CircleProgress
            title="Team Members"
            value={(project.members.length / totalWorkspaceMembers) * 100}
            subtitle={`${project.members.length} members`}
          />
        </Card>
      </div>

      <ProductivityTracker metrics={productivityMetrics} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <TaskDistributionChart tasks={tasks} />

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <ActivityFeed activities={activities.slice(0, 5)} />
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Recent Comments</h3>
              <CommentList comments={comments.slice(0, 5) as any} />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="p-4">
            <ProjectTimeline tasks={tasks} workspaceId={project.workspaceId} />
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="p-4">
            <ActivityFeed activities={activities} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
