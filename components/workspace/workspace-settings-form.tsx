"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Settings, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  deleteWorkspace,
  inviteUserToWorkspaceByMail,
  resetWorkspaceInviteCode,
  updateWorkspace,
} from "@/app/actions/workspace";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useConfirmation } from "@/hooks/use-confirmation";
import { workspaceSchema } from "@/utils/schema";
import { $Enums, Workspace } from "@prisma/client";
import { ConfirmationDialog } from "../confirmation-dialog";

interface DataProps extends Workspace {
  members: {
    userId: string;
    accessLevel: $Enums.AccessLevel;
  }[];
}

export const WorkspaceSettingsForm = ({ data }: { data: DataProps }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const { isOpen, confirm, handleConfirm, handleCancel, confirmationOptions } =
    useConfirmation();
  const [inviteEmail, setInviteEmail] = React.useState("");

  const form = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: data.name,
      description: data.description || "",
    },
  });

  const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/workspace-invite/${data.id}/join/${data.inviteCode}`;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard");
  };

  const handleDeleteWorkspace = () => {
    confirm({
      title: "Delete Workspace",
      message:
        "This action cannot be undone. This will permanently delete your workspace and remove all associated data.",
      onConfirm: async () => {
        try {
          setIsPending(true);
          await deleteWorkspace(data.id);
          toast.success("The workspace has been permanently deleted");
        } catch (error) {
          if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
            toast.error(
              error instanceof Error
                ? error.message
                : "Something went wrong. Please try again."
            );
          }
        } finally {
          setIsPending(false);
        }
      },
    });
  };

  const handleSubmit = async (values: z.infer<typeof workspaceSchema>) => {
    try {
      setIsLoading(true);
      await updateWorkspace(data.id, values);

      toast.success("Your workspace has been updated.");

      router.refresh();
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetInvite = async () => {
    try {
      setIsPending(true);
      await resetWorkspaceInviteCode(data.id);

      router.refresh();
      toast.success("Invite code reset successfully.");
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleInviteMember = async (email: string) => {
    try {
      if (!inviteEmail) {
        toast.error("Please enter an email address.");
        return;
      }
      setIsPending(true);
      await inviteUserToWorkspaceByMail(data.id, inviteEmail, inviteLink);

      router.refresh();
      toast.success("Invite code reset successfully.");
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            <span>Workspace Settings</span>
          </CardTitle>
          <CardDescription>
            Manage your workspace settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter workspace name" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter workspace description"
                      ></Textarea>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-end">
                <Button disabled={isLoading}>Save Changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between">
            Invite Members{" "}
            <span className="text-sm md:text-base text-muted-foreground">
              ({data?.members.length}{" "}
              {data?.members.length > 1 ? "members" : "Only you"} )
            </span>
          </CardTitle>
          <CardDescription>Add new members to your workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <Button
              onClick={() => handleInviteMember(inviteEmail)}
              disabled={isPending}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </div>

          <div className="p-3 bg-muted dark:bg-transparent rounded-lg">
            <Input value={inviteLink} readOnly className="italic" />
            <div className="flex items-center gap-2 justify-end mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={copyInviteLink}
                disabled={isPending}
              >
                <Link className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button
                variant={"destructive"}
                type="button"
                onClick={handleResetInvite}
                disabled={isPending}
              >
                <Link className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleDeleteWorkspace}
            disabled={isPending}
          >
            Delete Workspace
          </Button>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={confirmationOptions?.title || ""}
        message={confirmationOptions?.message || ""}
      />
    </div>
  );
};
