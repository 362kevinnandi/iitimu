import { requiredUser } from "@/app/data/user/is-user-authenticated";
import { getWorkspaceStatistics } from "@/app/data/workspace/get-workspace-stats";
import { WorkspaceCharts } from "@/components/workspace/workspace-charts";
import { WorkspaceRecentActivities } from "@/components/workspace/workspace-recent-activities";
import { WorkspaceStats } from "@/components/workspace/workspace-stats";
import { getProductivityMetrics } from "@/app/data/workspace/get-productivity-metrics";
import { ProductivityTracker } from "@/components/shared/productivity-tracker";

interface WorkspaceHomePageProps {
  params: Promise<{ workspaceId: string }>;
}

const WorkspaceHomePage = async ({ params }: WorkspaceHomePageProps) => {
  await requiredUser();
  const { workspaceId } = await params;

  const [workspaceStats, productivityMetrics] = await Promise.all([
    getWorkspaceStatistics(workspaceId),
    getProductivityMetrics(workspaceId),
  ]);

  const {
    totalProjects,
    totalMembers,
    totalTasks,
    assignedTasks,
    completedTasks,
    tasksByStatus,
    recentMembers,
    recentProjects,
    tasksTrend,
  } = workspaceStats;

  return (
    <div className="space-y-6 px-2 md:p-6">
      <WorkspaceStats
        totalProjects={totalProjects!}
        totalTasks={totalTasks!}
        assignedTasks={assignedTasks!}
        completedTasks={completedTasks!}
        totalMembers={totalMembers!}
      />

      <WorkspaceCharts
        tasksByStatus={tasksByStatus!}
        tasksTrend={tasksTrend!}
      />

      <ProductivityTracker metrics={productivityMetrics} />

      <WorkspaceRecentActivities
        recentMembers={
          recentMembers?.map((member) => ({
            id: member.userId,
            name: member.user.name,
            email: member.user.email,
            avatarUrl: member.user.image ?? undefined,
            joinedAt: member.createdAt.toISOString(),
          })) || []
        }
        recentProjects={
          recentProjects?.map((project) => ({
            id: project.id,
            name: project.name,
            createdAt: project.createdAt.toISOString(),
            tasksCount: project._count.tasks,
          })) || []
        }
      />
    </div>
  );
};

export default WorkspaceHomePage;
