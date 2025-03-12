import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createNewProject } from "@/app/actions/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { projectSchema } from "@/utils/schema";
import { WorkspaceMembersProps } from "@/utils/types";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface CreateProjectProps {
  onClose: () => void;
  workspaceMembers: WorkspaceMembersProps[];
}

export const CreateProjectForm = ({
  onClose,
  workspaceMembers,
}: CreateProjectProps) => {
  const workspaceId = useWorkspaceId();

  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      workspaceId: workspaceId,
      memberAccess: [],
    },
  });

  const handleSubmit = async (values: z.infer<typeof projectSchema>) => {
    try {
      setIsLoading(true);
      await createNewProject(values);

      toast.success("Project has been created.");

      form.reset();
      onClose();
      router.refresh();
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-none border-none">
      <CardContent className="px-0 pb-6 lg:pb-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
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

            <div>
              <FormField
                control={form.control}
                name="memberAccess"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Access</FormLabel>
                    <FormDescription className="text-xs text-muted-foreground mb-4">
                      Select which workspace members should have access to this
                      project
                    </FormDescription>
                    <div className="space-y-3 py-4">
                      {workspaceMembers.map((member) => (
                        <div
                          key={member.userId}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={member.userId}
                            checked={field.value?.includes(member.userId)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([
                                  ...currentValue,
                                  member.userId,
                                ]);
                              } else {
                                field.onChange(
                                  currentValue.filter(
                                    (id) => id !== member.userId
                                  )
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={member.userId}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                          >
                            {member.user.name} (
                            {member.accessLevel.toLowerCase()})
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="w-full md:w-fit"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-fit"
              >
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
