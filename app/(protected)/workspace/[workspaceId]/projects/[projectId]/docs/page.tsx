import { getProjectDocumentation } from "@/app/data/project/get-project-documentation";
import { ProjectTextEditor } from "@/components/richTextEditors/project-text-editor";

interface Props {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}
const ProjectDocumentationPage = async ({ params }: Props) => {
  const { workspaceId, projectId } = await params;

  const { doc, project } = await getProjectDocumentation(
    workspaceId,
    projectId
  );

  return (
    <div>
      <ProjectTextEditor
        data={doc!}
        workspaceId={workspaceId}
        project={project!}
      />
    </div>
  );
};

export default ProjectDocumentationPage;
