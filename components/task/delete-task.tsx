"use client";

import { useConfirmation } from "@/hooks/use-confirmation";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { deleteTaskByTaskId } from "@/app/actions/task";
import { useProjectId } from "@/hooks/use-project-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { ConfirmationDialog } from "../confirmation-dialog";
import { Button } from "../ui/button";

export const DeleteTask = ({ taskId }: { taskId: string }) => {
  const workspace = useWorkspaceId();
  const projectId = useProjectId();

  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const { isOpen, confirm, handleConfirm, handleCancel, confirmationOptions } =
    useConfirmation();

  const handleDeleteTask = () => {
    confirm({
      title: "Delete Task",
      message:
        "This action cannot be undone. This will permanently delete your task and remove all associated data.",
      onConfirm: async () => {
        try {
          setIsPending(true);
          await deleteTaskByTaskId(taskId, projectId, workspace);

          toast.success("The task has been permanently deleted");
          router.refresh();
        } catch (error) {
          if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
            toast.error(
              error.message || "Something went wrong. Please try again."
            );
          }
        } finally {
          setIsPending(false);
        }
      },
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleDeleteTask}
        disabled={isPending}
        className="text-red-600"
      >
        Delete Task
      </Button>

      <ConfirmationDialog
        isOpen={isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={confirmationOptions?.title || ""}
        message={confirmationOptions?.message || ""}
      />
    </>
  );
};
