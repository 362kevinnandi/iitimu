"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { requiredUser } from "@/app/data/user/is-user-authenticated";
import { db } from "@/lib/db";
import { generateInviteCode } from "@/utils";
import { workspaceSchema } from "@/utils/schema";
import { MAX_FREE_SETTINGS, MAX_PRO_SETTINGS } from "@/utils/settings";
import { $Enums } from "@prisma/client";
import { getUserWithSubscription } from "../data/user/get-user-subscription";
import { isUserWorkspaceMember } from "../data/user/is-user-workspace-member";

export const createNewWorkspace = async (
  data: z.infer<typeof workspaceSchema>
) => {
  const { user, isValid, plan } = await getUserWithSubscription();

  if (!isValid) {
    throw new Error("You do not have permission to create a workspace.");
  }

  if (plan !== "ENTERPRISE") {
    const numOfWorkspace = await db.workspace.count({
      where: {
        ownerId: user?.id!,
      },
    });

    if (plan === "FREE" && numOfWorkspace >= MAX_FREE_SETTINGS.WORKSPACES) {
      throw new Error("You have reached the maximum number of workspaces.");
    }

    if (plan === "PRO" && numOfWorkspace >= MAX_PRO_SETTINGS.WORKSPACES) {
      throw new Error("You have reached the maximum number of workspaces.");
    }
  }

  const validatedData = workspaceSchema.parse(data);

  const workspace = await db.workspace.create({
    data: {
      name: validatedData.name,
      description: validatedData.description || "",
      ownerId: user?.id!,
      inviteCode: generateInviteCode(),
      members: {
        create: {
          userId: user?.id!,
          accessLevel: "OWNER",
        },
      },
    },
  });

  redirect(`/workspace/${workspace.id}`);
};

export const updateWorkspace = async (
  workspaceId: string,
  data: z.infer<typeof workspaceSchema>
) => {
  const { user } = await requiredUser();

  const validatedData = workspaceSchema.parse(data);

  const isUserAMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: workspaceId,
      },
    },
  });

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace.");
  }

  if (isUserAMember && isUserAMember.accessLevel !== $Enums.AccessLevel.OWNER) {
    throw new Error("You do not have permission to update this workspace.");
  }

  await db.workspace.update({
    where: { id: workspaceId },
    data: {
      name: validatedData.name,
      description: validatedData.description || "",
    },
  });
};

export const resetWorkspaceInviteCode = async (workspaceId: string) => {
  const { user } = await requiredUser();
  const { isUserAMember } = await isUserWorkspaceMember(user.id, workspaceId);

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace.");
  }
  if (isUserAMember && isUserAMember.accessLevel !== $Enums.AccessLevel.OWNER) {
    throw new Error("You do not have permission to update this workspace.");
  }

  await db.workspace.update({
    where: { id: workspaceId },
    data: {
      inviteCode: generateInviteCode(),
    },
  });
};

export const deleteWorkspace = async (workspaceId: string) => {
  const { user } = await requiredUser();
  const { isUserAMember } = await isUserWorkspaceMember(user.id, workspaceId);

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace.");
  }

  if (isUserAMember && isUserAMember.accessLevel !== $Enums.AccessLevel.OWNER) {
    throw new Error("You do not have permission to delete this workspace.");
  }

  await db.workspace.delete({ where: { id: workspaceId } });

  redirect("/workspace");
};

export const joinWorkspace = async (
  workspaceId: string,
  inviteCode: string
) => {
  const { user } = await requiredUser();

  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId, inviteCode: inviteCode },
    include: {
      members: {
        select: { id: true, userId: true },
      },
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found.");
  }
  if (workspace.inviteCode !== inviteCode) {
    throw new Error("Invalid invite code.");
  }

  const [{ isUserAMember }, ownerInfo] = await Promise.all([
    isUserWorkspaceMember(user.id, workspaceId),
    db.user.findUnique({
      where: {
        id: workspace.ownerId,
      },
      include: {
        subscription: { select: { plan: true, status: true } },
      },
    }),
  ]);

  if (isUserAMember) {
    throw new Error("You are already a member of this workspace.");
  }

  if (
    ownerInfo?.subscription?.plan === "FREE" &&
    workspace.members.length >= MAX_FREE_SETTINGS.MEMBERS
  ) {
    throw new Error(
      "You have reached the maximum number of workspace members."
    );
  }

  if (
    ownerInfo?.subscription?.plan === "PRO" &&
    workspace.members.length >= MAX_PRO_SETTINGS.MEMBERS
  ) {
    throw new Error(
      "You have reached the maximum number of workspace members."
    );
  }

  const joinedInfo = await db.workspaceMember.create({
    data: {
      userId: user.id,
      workspaceId: workspaceId,
      accessLevel: $Enums.AccessLevel.VIEWER,
    },
    select: { user: { select: { id: true, name: true, email: true } } },
  });

  await fetch(`${process.env.BASE_URL}/api/send`, {
    method: "POST",
    body: JSON.stringify({
      name: ownerInfo?.name,
      email: ownerInfo?.email,
      message: `${joinedInfo.user.name} has joined your workspace ${workspace.name} through the invitation link.`,
      subject: `${joinedInfo.user.name} has accepted your invitation to join ${workspace.name}`,
      buttonText: "View Members",
      link: `${process.env.BASE_URL}/workspace/${workspace.id}/members`,
    }),
  });

  redirect(`/workspace/${workspace.id}`);
};

export const removeUserFromWorkspace = async (
  workspaceId: string,
  workspaceMemberId: string
) => {
  const { user } = await requiredUser();

  const { isUserAMember } = await isUserWorkspaceMember(user.id, workspaceId);

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace.");
  }

  if (isUserAMember && isUserAMember.accessLevel !== $Enums.AccessLevel.OWNER) {
    throw new Error(
      "You do not have permission to remove users from this workspace."
    );
  }

  const isLastOwner = await db.workspaceMember.findFirst({
    where: {
      workspaceId: workspaceId,
      accessLevel: $Enums.AccessLevel.OWNER,
    },
  });

  if (isLastOwner && isLastOwner.id === workspaceMemberId) {
    throw new Error("You cannot remove the last owner from the workspace.");
  }

  await db.workspaceMember.delete({ where: { id: workspaceMemberId } });

  return { success: true, message: "User removed from workspace." };
};

export const updateUserAccessLevel = async (
  workspaceId: string,
  workspaceMemberId: string,
  accessLevel: $Enums.AccessLevel
) => {
  const { user } = await requiredUser();

  const { isUserAMember } = await isUserWorkspaceMember(user.id, workspaceId);

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace.");
  }

  if (isUserAMember && isUserAMember.accessLevel !== $Enums.AccessLevel.OWNER) {
    throw new Error("You do not have permission to update this workspace.");
  }

  await db.workspaceMember.update({
    where: { id: workspaceMemberId },
    data: { accessLevel },
  });

  return { success: true };
};

export const updateProjectAccess = async (
  workspaceId: string,
  workspaceMemberId: string,
  projectIds: string[]
) => {
  const { user } = await requiredUser();

  const { isUserAMember } = await isUserWorkspaceMember(user.id, workspaceId);

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace.");
  }

  if (isUserAMember && isUserAMember.accessLevel !== $Enums.AccessLevel.OWNER) {
    throw new Error("You do not have permission to update this workspace.");
  }

  const oldProjectAccess = await db.projectAccess.findMany({
    where: {
      workspaceMemberId: workspaceMemberId,
    },
  });

  const projectAccessToDelete = oldProjectAccess.filter(
    (access) => !projectIds.includes(access.projectId) || !access.hasAccess
  );

  if (projectAccessToDelete.length > 0) {
    await db.projectAccess.deleteMany({
      where: {
        id: {
          in: projectAccessToDelete.map((access) => access.id),
        },
      },
    });
  }

  const projectAccessToAdd = projectIds.filter(
    (projectId) =>
      !oldProjectAccess.some(
        (access) => access.projectId === projectId && access.hasAccess === true
      )
  );

  if (projectAccessToAdd.length > 0) {
    await db.projectAccess.createMany({
      data: projectAccessToAdd.map((projectId) => ({
        workspaceMemberId: workspaceMemberId,
        projectId: projectId,
        hasAccess: true,
      })),
    });
  }

  return { success: true };
};

export const inviteUserToWorkspaceByMail = async (
  workspaceId: string,
  email: string,
  inviteLink: string
) => {
  const { user, plan, isValid } = await getUserWithSubscription();

  if (!isValid || plan === "FREE") {
    throw new Error(
      "You can not invite users to this workspace because you do not have a subscription."
    );
  }

  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new Error("Workspace not found.");
  }

  const isUserWorkspaceOwner = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user?.id!,
        workspaceId: workspaceId,
      },
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!isUserWorkspaceOwner) {
    throw new Error("You are not a member of this workspace.");
  }

  if (isUserWorkspaceOwner?.accessLevel !== $Enums.AccessLevel.OWNER) {
    throw new Error(
      "You do not have permission to invite users to this workspace."
    );
  }

  const userInvited = await db.user.findUnique({
    where: { email: email },
    include: {
      workspaces: {
        where: {
          userId: user?.id!,
          workspaceId: workspaceId,
        },
      },
    },
  });

  if (!userInvited) {
    throw new Error("User not found.");
  }

  if (userInvited.workspaces.length > 0) {
    throw new Error("User is already a member of this workspace.");
  }

  await db.notification.create({
    data: {
      userId: userInvited.id,
      message: `${isUserWorkspaceOwner?.user?.name} has invited you to join ${workspace?.name}`,
      type: "WORKSPACE_INVITE",
      link: inviteLink,
    },
  });

  await fetch(`${process.env.BASE_URL}/api/send`, {
    method: "POST",
    body: JSON.stringify({
      name: userInvited.name,
      email: userInvited.email,
      message:
        "You are invited to join a workspace. Click the button below to accept the invitation.",
      subject: `${isUserWorkspaceOwner?.user?.name} has invited you to join ${workspace?.name}`,
      buttonText: "Accept Invitation",
      link: inviteLink,
    }),
  });

  return { success: true, message: "User invitation sent." };
};
