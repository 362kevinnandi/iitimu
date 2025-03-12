"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createSubscription } from "@/app/actions/subscription";
import { PRICING } from "@/utils";
import { Subscription, User } from "@prisma/client";
import PricingCard from "./pricing-card";

export interface UserProps extends User {
  subscription: Subscription;
  isSubscriptionActive: boolean;
}

export const PricingList = ({
  currentPlan,
  user,
}: {
  currentPlan: string;
  user: UserProps;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async (planName: string) => {
    try {
      if (!user || !user?.id) {
        toast.error("Error getting user information.");
        return;
      }

      setLoading(true);

      const checkout = await createSubscription(
        planName?.toLowerCase() as "pro" | "enterprise"
      );

      if (checkout.success) {
        router.push(checkout.url);
      } else {
        toast.error("Failed Checkout", { description: checkout.message });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed.", {
        description: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Available Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRICING.slice(1).map((plan) => (
          <PricingCard
            key={plan.plan}
            plan={plan}
            isCurrentPlan={currentPlan === plan.plan.toUpperCase()}
            onSelect={() => handleUpgrade(plan.plan)}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};
