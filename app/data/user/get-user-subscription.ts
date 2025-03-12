import "server-only";

import { db } from "@/lib/db";
import { $Enums } from "@prisma/client";
import { requiredUser } from "./is-user-authenticated";

export const getUserWithSubscription = async () => {
  const { user } = await requiredUser();

  const userInfo = await db.user.findUnique({
    where: { id: user?.id },
    include: {
      subscription: true,
    },
  });

  if (!userInfo) {
    throw new Error("User not found");
  }

  if (!userInfo.subscription || userInfo.subscription.plan === "FREE") {
    return {
      isValid: true,
      user: userInfo,
      plan: "FREE",
      reason: "No active subscription (FREE PLAN)",
    };
  }

  const { plan, status, cancelAtPeriodEnd, currentPeriodEnd } =
    userInfo?.subscription;

  const now = new Date();

  // Check if the subscription is expired
  const isExpired = currentPeriodEnd ? now > currentPeriodEnd : true;

  // Check if the subscription is still active or if it's canceled but valid till period end
  const isValid =
    (status === $Enums.SubscriptionStatus.ACTIVE && !isExpired) || // Active and not expired
    (status === $Enums.SubscriptionStatus.CANCELLED &&
      cancelAtPeriodEnd &&
      currentPeriodEnd &&
      now <= currentPeriodEnd); // Canceled but valid till period end

  return {
    user: userInfo,
    isValid,
    plan,
    reason: isValid
      ? "Subscription is active or valid till period end"
      : "Subscription expired or invalid",
    expiresAt: currentPeriodEnd,
  };
};
