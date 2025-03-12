"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { deleteProject, updateProject } from "@/app/actions/project";
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
import { projectSchema } from "@/utils/schema";
import { $Enums, Project, Workspace } from "@prisma/client";
import { ConfirmationDialog } from "../confirmation-dialog";

interface DataProps extends Workspace {
  members: {
    userId: string;
    accessLevel: $Enums.AccessLevel;
  }[];
}

export const ProjectSettingsForm = ({ data }: { data: Project }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const { isOpen, confirm, handleConfirm, handleCancel, confirmationOptions } =
    useConfirmation();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: data.name,
      description: data.description || "",
      workspaceId: data.workspaceId,
    },
  });

  const handleDeleteProject = () => {
    confirm({
      title: "Delete Project",
      message:
        "This action cannot be undone. This will permanently delete your project and remove all associated data.",
      onConfirm: async () => {
        try {
          setIsPending(true);
          await deleteProject(data.id);

          toast.success("The project has been permanently deleted");
          router.push("/workspace");
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

  const handleSubmit = async (values: z.infer<typeof projectSchema>) => {
    try {
      setIsLoading(true);
      await updateProject(data.id, values);

      toast.success("Your project has been updated.");

      router.refresh();
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Project Settings</h1>
        </div>

        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="size-4 mr-2" />
          <span>Back</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="hidden">
          <CardTitle>Edit Project</CardTitle>
        </CardHeader>
        <CardContent>
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
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleDeleteProject}
            disabled={isPending}
          >
            Delete Project
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
