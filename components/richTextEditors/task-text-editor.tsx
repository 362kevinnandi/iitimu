/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { updateTaskDocumentation } from "@/app/actions/task";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TaskDocument } from "@prisma/client";

import { Button } from "../ui/button";
import { MenuBar } from "./menu-bar";

export const TaskTextEditor = ({
  taskId,
  taskDocuments,
}: {
  taskId: string;
  taskDocuments: TaskDocument[];
}) => {
  const [documentation, setDocumentation] = useState<any>(
    taskDocuments[0]?.content || ""
  );

  const [pending, setPending] = useState(false);
  const workspaceId = useWorkspaceId();

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
      setPending(true);

      await updateTaskDocumentation(taskId, documentation, workspaceId);

      toast.success("Update", {
        description: "Documentation updated successfully",
      });
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium">Documentation</h3>
      <div className="border rounded-md  mt-2 overflow-hidden bg-card">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={saveDocumentation} disabled={pending}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};
