import { getProjectById } from "@/app/data/project/get-project-by-id";
import { ProjectSettingsForm } from "@/components/project/project-settings-form";
import { Project } from "@prisma/client";

interface ProjectSettingsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const ProjectSettingsPage = async ({ params }: ProjectSettingsPageProps) => {
  const { projectId } = await params;

  const project = await getProjectById(projectId);

  return (
    <div className="flex w-full items-center min-h-screen">
      <ProjectSettingsForm data={project as Project} />
    </div>
  );
};

export default ProjectSettingsPage;
