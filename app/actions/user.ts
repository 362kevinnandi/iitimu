"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/lib/db";
import { requiredUser } from "@/app/data/user/is-user-authenticated";
import { userSchema } from "@/utils/schema";

export const createUser = async (data: z.infer<typeof userSchema>) => {
  const { user } = await requiredUser();

  const validatedData = userSchema.parse(data);

  const userData = await db.user.create({
    data: {
      id: user.id!,
      name: validatedData.name,
      email: user.email!,
      about: validatedData.about || "",
      country: validatedData.country,
      industryType: validatedData.industryType,
      role: validatedData.role,
      onboardingCompleted: true,
      image: user.picture || `https://avatar.vercel.sh/${validatedData.name}`,
      subscription: {
        create: {
          plan: "FREE",
          status: "ACTIVE",
          currentPeriodEnd: new Date(),
          cancelAtPeriodEnd: false,
        },
      },
      notifications: {
        create: {
          type: "SYSTEM_MESSAGE",
          message:
            "Welcome to TM-iitimu! We’re thrilled to have you join our community. Your Journey to Productivity Starts Here. Thank you for signing up for TM-iitimu",
        },
      },
    },

    select: {
      id: true,
      name: true,
      email: true,
      workspaces: true,
    },
  });

  if (userData) {
    await fetch(`${process.env.BASE_URL}/api/send`, {
      method: "POST",
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        message:
          "Welcome to TM-iitimu! We’re thrilled to have you join our community. Your Journey to Productivity Starts Here. Thank you for signing up for TM-iitimu",
        subject: "Welcome to TM-iitimu",
        buttonText: "Get Started",
        link: process.env.NEXT_PUBLIC_APP_URL!,
      }),
    });
  }

  if (userData.workspaces.length === 0) {
    redirect("/create-workspace");
  }

  redirect("/workspace");
};

export const updateUser = async (data: z.infer<typeof userSchema>) => {
  const { user } = await requiredUser();

  const validatedData = userSchema.parse(data);

  await db.user.update({
    where: {
      id: user.id!,
    },
    data: validatedData,
  });

  return { success: true, message: "User updated successfully" };
};
