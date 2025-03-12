import { db } from "@/lib/db";
import { requiredUser } from "./is-user-authenticated";

export const getUserById = async () => {
  try {
    const { user } = await requiredUser();

    const data = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: true,
      message: "Failed to get user",
      status: 500,
    };
  }
};
