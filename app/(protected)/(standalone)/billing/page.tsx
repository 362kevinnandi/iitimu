import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { getUserWithSubscription } from "@/app/data/user/get-user-subscription";
import { PricingList, UserProps } from "@/components/billing/pricing-list";
import SubscriptionDetails from "@/components/billing/subscription-details";
import { Button } from "@/components/ui/button";

const BillingPage = async () => {
  const { user } = await getUserWithSubscription();

  const subscription = {
    plan: user?.subscription?.plan || "STARTER",
    status: user?.subscription?.status || "ACTIVE",
    currentPeriodEnd:
      user?.subscription?.currentPeriodEnd?.toISOString() ||
      new Date().toISOString(),
    cancelAtPeriodEnd: user?.subscription?.cancelAtPeriodEnd || false,
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <Link href="/workspace">
        <Button variant="outline" className="p-0">
          <ArrowLeftIcon className="size-5 mr-2" />
          Back to Home
        </Button>
      </Link>
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {user?.subscription ? (
        <SubscriptionDetails subscription={subscription} />
      ) : null}

      <PricingList
        currentPlan={subscription.plan}
        user={user as unknown as UserProps}
      />
    </div>
  );
};

export default BillingPage;
