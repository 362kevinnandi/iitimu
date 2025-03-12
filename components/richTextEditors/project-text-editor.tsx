/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createProjectDocumentation } from "@/app/actions/project";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { MenuBar } from "./menu-bar";
import { ProjectDocument } from "@prisma/client";

interface Props {
  data: ProjectDocument;
  project: { id: string; name: string };
  workspaceId: string;
}
export const ProjectTextEditor = ({ data, project, workspaceId }: Props) => {
  const [documentation, setDocumentation] = useState<any>(data?.content || "");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,

      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      //   Mention.configure({
      //     suggestion: {
      //       items: (query) => {
      //         // Implement document suggestion logic
      //         return [];
      //       },
      //     },
      //   }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] p-4 max-w-none dark:prose-invert",
      },
    },

    onUpdate: ({ editor }) => {
      const content = editor.getJSON();

      setDocumentation(JSON.stringify(content));
    },
    content: documentation ? JSON.parse(documentation) : "",
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && documentation && editor.getHTML() !== documentation) {
      editor.commands.setContent(JSON.parse(documentation));
    }
  }, [editor, documentation]);

  const saveDocumentation = async () => {
    try {
      if (!documentation) {
        toast.error("Documentation is empty");
        return;
      }
      setPending(true);
      await createProjectDocumentation(workspaceId, project.id, documentation);
      router.refresh();
      toast.success("Documentation saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save documentation");
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <h1 className="text-lg lg:text-2xl font-bold">
        {project.name} Documentation
      </h1>
      <div className="border rounded-md p-4 mt-2 overflow-hidden bg-card">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-end mt-4">
        <Button disabled={pending} onClick={saveDocumentation}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};
