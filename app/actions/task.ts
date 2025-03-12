"use server";

import { TaskStatus } from "@prisma/client";
import { z } from "zod";

import { requiredUser } from "@/app/data/user/is-user-authenticated";
import { db } from "@/lib/db";
import { taskFormSchema } from "@/utils/schema";
import { MAX_FREE_SETTINGS, MAX_PRO_SETTINGS } from "@/utils/settings";
import { getTasksByProjectId } from "../data/task/get-tasks";

export const createTask = async (
  data: z.infer<typeof taskFormSchema>,
  projectId: string,
  workspaceId: string
) => {
  const validatedData = taskFormSchema.parse(data);
  const { user } = await requiredUser();

  const isWorkspaceMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
    include: {
      workspace: { select: { id: true, ownerId: true } },
    },
  });

  if (!isWorkspaceMember) {
    throw new Error("You are not a member of this workspace");
  }

  const [subInfo, taskCount] = await Promise.all([
    db.subscription.findUnique({
      where: { userId: isWorkspaceMember.workspace.ownerId },
    }),
    db.task.count({ where: { projectId } }),
  ]);

  if (subInfo && subInfo.plan !== "ENTERPRISE") {
    if (subInfo.plan === "FREE" && taskCount >= MAX_FREE_SETTINGS.TASKS) {
      throw new Error("You have reached the maximum number of tasks.");
    }
    if (subInfo.plan === "PRO" && taskCount >= MAX_PRO_SETTINGS.TASKS) {
      throw new Error("You have reached the maximum number of tasks.");
    }
  }

  const {
    title,
    description,
    assigneeId,
    status,
    dueDate,
    startDate,
    priority,
    attachments,
  } = validatedData;

  if (startDate && new Date(startDate) > new Date(dueDate)) {
    throw new Error("Start date cannot be greater than due date");
  }

  if (subInfo?.plan === "FREE" && attachments && attachments.length > 0) {
    throw new Error("You cannot upload attachments on the free plan.");
  }

  const { tasks } = await getTasksByProjectId(projectId);

  const lastTask = tasks
    ?.filter((task) => task.status === data.status)
    .sort((a, b) => b.position - a.position)[0];

  const position = lastTask ? lastTask.position + 1000 : 1000;

  const [task, _] = await Promise.all([
    db.task.create({
      data: {
        title,
        description,
        assignedToId: assigneeId || user.id,
        status,
        dueDate: new Date(dueDate),
        startDate: new Date(startDate),
        priority,
        projectId,
        position,
      },
    }),
    db.activity.create({
      data: {
        type: "TASK_CREATED",
        description: `created task "${title}"`,
        projectId,
        userId: user.id,
      },
    }),
  ]);

  if (attachments && attachments.length > 0) {
    await db.file.createMany({
      data: attachments.map((attachment) => ({
        ...attachment,
        taskId: task.id,
      })),
    });
  }

  return task;
};

export const updateTaskPosition = async (
  taskId: string,
  newPosition: number,
  status: TaskStatus
) => {
  const { user } = await requiredUser();

  if (!user) {
    return new Error("Unauthorized");
  }

  const task = await db.task.update({
    where: {
      id: taskId,
    },
    data: {
      position: newPosition,
      status,
    },
  });

  return task;
};

export const updateTask = async (
  taskId: string,
  projectId: string,
  workspaceId: string,
  data: z.infer<typeof taskFormSchema>
) => {
  const validatedData = taskFormSchema.parse(data);
  const { user } = await requiredUser();

  if (!user) {
    return new Error("Unauthorized");
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

  if (!projectAccess || !projectAccess.hasAccess) {
    throw new Error("You do not have access to this project");
  }

  const task = await db.task.update({
    where: {
      id: taskId,
    },
    data: {
      title: validatedData.title,
      description: validatedData.description,
      assignedToId: validatedData.assigneeId,
      status: validatedData.status,
      dueDate: validatedData.dueDate,
      priority: validatedData.priority,
    },
  });

  if (validatedData.attachments && validatedData.attachments.length > 0) {
    await db.file.createMany({
      data: validatedData.attachments.map((attachment) => ({
        ...attachment,
        taskId: task.id,
      })),
    });
  }

  await db.activity.create({
    data: {
      type: "TASK_UPDATED",
      description: `updated task "${task.title}"`,
      projectId: task.projectId,
      userId: user.id,
    },
  });

  return task;
};

export const deleteTaskByTaskId = async (
  taskId: string,
  projectId: string,
  workspaceId: string
) => {
  const { user } = await requiredUser();

  if (!user) {
    return new Error("Unauthorized");
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
        projectId: projectId,
      },
    },
  });

  if (!projectAccess) {
    throw new Error("You do not have access to this project");
  }

  await db.task.delete({
    where: {
      id: taskId,
    },
  });

  return {
    success: true,
    message: "Task deleted successfully",
  };
};

export const moveTaskToNewDate = async (taskId: string, newDate: Date) => {
  const { user } = await requiredUser();

  if (!user) {
    return new Error("Unauthorized");
  }

  const task = await db.task.findUnique({
    where: {
      id: taskId,
    },
  });
  if (task?.startDate && new Date(task.startDate) > new Date(newDate)) {
    throw new Error("Start date cannot be greater than due date");
  }

  await db.task.update({
    where: {
      id: taskId,
    },
    data: {
      dueDate: new Date(newDate),
    },
  });

  return {
    success: true,
    message: "Task moved to new date successfully",
  };
};

export const updateTaskDocumentation = async (
  taskId: string,
  documentation: string,
  workspaceId: string
) => {
  const { user } = await requiredUser();

  if (!user) {
    return new Error("Unauthorized");
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

  await db.taskDocument.upsert({
    where: { taskId },
    update: { content: documentation },
    create: { taskId, content: documentation },
  });

  return { success: true, message: "Documentation updated successfully" };
};
