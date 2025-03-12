"use server";

import { db } from "@/lib/db";
import { requiredUser } from "../data/user/is-user-authenticated";

export const createTimeLog = async ({
  taskId,
  startTime,
}: {
  taskId: string;
  startTime: string;
}) => {
  const { user } = await requiredUser();
  if (!user) throw new Error("Unauthorized");

  return await db.timeLog.create({
    data: {
      taskId,
      userId: user.id,
      startTime: new Date(startTime),
    },
  });
};

export const endTimeLog = async ({
  timeLogId,
  endTime,
}: {
  timeLogId: string;
  endTime: string;
}) => {
  const { user } = await requiredUser();
  if (!user) throw new Error("Unauthorized");

  const endTimeDate = new Date(endTime);
  const timeLog = await db.timeLog.findUnique({
    where: { id: timeLogId },
  });

  if (!timeLog) throw new Error("Time log not found");

  const duration = Math.floor(
    (endTimeDate.getTime() - timeLog.startTime.getTime()) / 1000
  );

  return await db.timeLog.update({
    where: { id: timeLogId },
    data: {
      endTime: endTimeDate,
      duration,
    },
  });
};
