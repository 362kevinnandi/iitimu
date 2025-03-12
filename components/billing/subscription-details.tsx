"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  cancelSubscriptionByMenSqueezyId,
  resumeSubscription,
} from "@/app/actions/subscription";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SubscriptionDetailsProps {
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
}

const SubscriptionDetails = ({ subscription }: SubscriptionDetailsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setLoading(true);
      await cancelSubscriptionByMenSqueezyId();

      toast.success("Cancelling subscription", {
        description: "Processing your cancellation request...",
      });

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel subscription", {
        description:
          "You subscription could not be cancelled, Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    try {
      setLoading(true);
      await resumeSubscription();

      toast.success("Renewing subscription", {
        description: "Processing your renewal request...",
      });

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to resume subscription", {
        description: "You subscription could not be resumed, Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
        <CardDescription>Manage your subscription here</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Current Plan</span>
          <span>{subscription.plan}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Status</span>
          <span
            className={cn(
              subscription.status === "ACTIVE"
                ? "text-green-500"
                : "text-red-600",
              "font-bold"
            )}
          >
            {subscription.status}
          </span>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="font-medium">
              {subscription.cancelAtPeriodEnd ? "Expire" : "Renewal"} Date
            </span>
            {subscription.cancelAtPeriodEnd && (
              <span className="text-sm text-muted-foreground">
                Package will not be renewed after this date.
              </span>
            )}
          </div>
          <span>
            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
      {subscription.plan !== "FREE" && (
        <CardFooter className="flex justify-end space-x-4">
          {subscription.cancelAtPeriodEnd ? (
            <Button disabled={loading} onClick={handleRenew}>
              {loading ? "Resuming..." : "Resume Subscription"}
            </Button>
          ) : (
            <Button
              disabled={loading}
              variant="destructive"
              onClick={handleCancel}
            >
              {loading ? "Cancelling..." : "Cancel Subscription"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default SubscriptionDetails;
