"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { joinWorkspace } from "@/app/actions/workspace";

interface DataProps {
  name: string;
  description: string;
  inviteCode: string;
  workspaceId: string;
}
export const JoinWorkspace = ({ workspace }: { workspace: DataProps }) => {
  const router = useRouter();

  const [pending, setPending] = useState(false);

  const handleJoinWorkspace = async () => {
    setPending(true);

    try {
      await joinWorkspace(workspace.workspaceId, workspace.inviteCode);
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Workspace</CardTitle>
          <CardDescription>
            You have been invited to join the workspace{" "}
            <strong>{workspace.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-3 mt-5">
          <Button
            variant="outline"
            onClick={() => router.push("/workspace")}
            className="w-full md:w-1/3"
            disabled={pending}
          >
            Cancel
          </Button>

          <Button
            onClick={handleJoinWorkspace}
            className="w-full"
            disabled={pending}
            type="button"
          >
            {pending ? "Joining..." : "Join Workspace"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
