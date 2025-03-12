import { db } from "@/lib/db";
import { requiredUser } from "./is-user-authenticated";

export async function getNotifications() {
  try {
    const { user } = await requiredUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const notifications = await db.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { notifications };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get notifications",
      status: 500,
    };
  }
}
