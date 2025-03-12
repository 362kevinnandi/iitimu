"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createComment } from "@/app/actions/project";
import { useProjectId } from "@/hooks/use-project-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Comment, User } from "@prisma/client";
import { CommentList } from "./comment-list";

type CommentWithUser = Comment & {
  user: User;
};

interface TaskCommentsProps {
  taskId: string;
  comments: CommentWithUser[];
}

export const TaskComments = ({ taskId, comments }: TaskCommentsProps) => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const router = useRouter();

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    setIsSubmitting(true);
    try {
      await createComment(workspaceId, projectId, newComment.trim());

      toast.success("New Comment", {
        description: "Comment posted successfully",
      });
      setNewComment("");
      router.refresh();
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Textarea
            placeholder="Add a comment..."
            className="min-h-[100px]"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>

        <CommentList comments={comments as any} />
      </CardContent>
    </Card>
  );
};
