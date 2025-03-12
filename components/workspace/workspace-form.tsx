"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createNewWorkspace } from "@/app/actions/workspace";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { workspaceSchema } from "@/utils/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export const CreateWorkspaceForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof workspaceSchema>) => {
    try {
      setIsLoading(true);
      await createNewWorkspace(values);

      toast.success("Your workspace has been created.");

      router.push("/workspace");
    } catch (error) {
      console.log(error);
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error(
          error?.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-0 md:p-6 max-w-xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Create New Workspace
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Set up a new workspace for yourself and or your team
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 md:p-6">
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

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/workspace")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Workspace"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
