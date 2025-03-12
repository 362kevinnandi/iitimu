"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { requiredUser } from "@/app/data/user/is-user-authenticated";
import { db } from "@/lib/db";
import { projectSchema } from "@/utils/schema";
import { MAX_FREE_SETTINGS, MAX_PRO_SETTINGS } from "@/utils/settings";
import { $Enums } from "@prisma/client";
import { isUserWorkspaceMember } from "../data/user/is-user-workspace-member";

export const createNewProject = async (data: z.infer<typeof projectSchema>) => {
  const { user } = await requiredUser();

  const workspace = await db.workspace.findUnique({
    where: {
      id: data.workspaceId,
    },
    include: {
      projects: { select: { id: true } },
    },
  });

  const ownerInfo = await db.user.findUnique({
    where: {
      id: workspace?.ownerId,
    },
    include: {
      subscription: { select: { plan: true } },
    },
  });

  if (ownerInfo?.subscription?.plan !== "ENTERPRISE") {
    if (
      ownerInfo?.subscription?.plan === "FREE" &&
      workspace?.projects &&
      workspace?.projects?.length >= MAX_FREE_SETTINGS.PROJECTS
    ) {
      throw new Error("You have reached the maximum number of workspaces.");
    }

    if (
      ownerInfo?.subscription?.plan === "PRO" &&
      workspace?.projects &&
      workspace?.projects?.length >= MAX_PRO_SETTINGS.PROJECTS
    ) {
      throw new Error("You have reached the maximum number of workspaces.");
    }
  }

  const validatedData = projectSchema.parse(data);

  const workspaceMembers = await db.workspaceMember.findMany({
    where: {
      workspaceId: validatedData.workspaceId,
    },
  });

  const isUserAMember = workspaceMembers.some(
    (member) => member.userId === user.id
  );

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace");
  }

  if (validatedData.memberAccess?.length === 0) {
    validatedData.memberAccess = [user.id];
  } else if (!validatedData.memberAccess?.includes(user.id)) {
    validatedData.memberAccess?.push(user.id);
  }

  const project = await db.project.create({
    data: {
      name: validatedData.name,
      description: validatedData.description,
      workspaceId: validatedData.workspaceId,
      projectAccess: {
        create: validatedData.memberAccess?.map((userId) => ({
          workspaceMemberId: workspaceMembers.find(
            (member) => member.userId === userId
          )?.id!,
          hasAccess: true,
        })),
      },
      activities: {
        create: {
          type: "PROJECT_CREATED",
          description: `created project "${validatedData.name}"`,
          userId: user.id,
        },
      },
    },
  });

  return project;
};

export const updateProject = async (
  projectId: string,
  data: z.infer<typeof projectSchema>
) => {
  const { user } = await requiredUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const validatedData = projectSchema.parse(data);

  const { isUserAMember } = await isUserWorkspaceMember(
    user.id,
    validatedData.workspaceId
  );

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace");
  }

  if (isUserAMember.accessLevel === $Enums.AccessLevel.VIEWER) {
    throw new Error("You do not have permission to update this project");
  }

  const project = await db.project.update({
    where: { id: projectId },
    data: validatedData,
  });

  await db.activity.create({
    data: {
      type: "PROJECT_UPDATED",
      description: `updated project "${project.name}"`,
      projectId: project.id,
      userId: user.id,
    },
  });

  return project;
};

export const deleteProject = async (projectId: string) => {
  const { user } = await requiredUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const isUserAMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: project.workspaceId,
      },
    },
  });

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace");
  }

  if (isUserAMember.accessLevel !== $Enums.AccessLevel.OWNER) {
    throw new Error("You do not have permission to delete this project");
  }

  await db.project.delete({
    where: { id: projectId },
  });

  return { success: true };
};

export const createComment = async (
  workspaceId: string,
  projectId: string,
  content: string
) => {
  const { user } = await requiredUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const isMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });

  if (!isMember) {
    throw new Error("You are not a member of this workspace");
  }

  const projectAccess = await db.projectAccess.findUnique({
    where: {
      workspaceMemberId_projectId: {
        workspaceMemberId: isMember.id,
        projectId,
      },
    },
  });

  if (!projectAccess) {
    throw new Error("You do not have access to this project");
  }

  const comment = await db.comment.create({
    data: {
      content,
      projectId,
      userId: user.id,
    },
  });

  return comment;
};

export const createProjectDocumentation = async (
  workspaceId: string,
  projectId: string,
  content: string
) => {
  const { user } = await requiredUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const isMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });

  if (!isMember) {
    throw new Error("You are not a member of this workspace");
  }

  const projectAccess = await db.projectAccess.findUnique({
    where: {
      workspaceMemberId_projectId: {
        workspaceMemberId: isMember.id,
        projectId,
      },
    },
  });

  if (!projectAccess) {
    throw new Error("You do not have access to this project");
  }

  const documentation = await db.projectDocument.upsert({
    where: { projectId },
    update: { content, updatedBy: user.id },
    create: { projectId, content, updatedBy: user.id },
    include: { project: { select: { name: true } } },
  });

  await db.activity.create({
    data: {
      type: "PROJECT_DOCUMENTATION_UPDATED",
      description: `updated project documentation for "${documentation.project.name}"`,
      projectId: projectId,
      userId: user.id,
    },
  });

  return documentation;
};
