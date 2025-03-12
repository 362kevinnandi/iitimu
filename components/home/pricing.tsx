import { CheckCircle, Infinity, Target, Users } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { PRICING } from "@/utils";
import { Button } from "../ui/button";

type PlanType = "starter" | "pro" | "enterprise";

const getIconVariant = (plan: PlanType) => {
  const variants = {
    starter: {
      bgColor: "bg-pink-500/15",
      icon: Users,
      iconColor: "text-pink-600",
    },
    pro: {
      bgColor: "bg-indigo-500/15",
      icon: Target,
      iconColor: "text-indigo-600",
    },
    enterprise: {
      bgColor: "bg-purple-500/15",
      icon: Infinity,
      iconColor: "text-purple-600",
    },
  };

  return variants[plan];
};

const IconVariant = ({ plan }: { plan: PlanType }) => {
  const { bgColor, icon: Icon, iconColor } = getIconVariant(plan);

  return (
    <div
      className={`h-12 w-12 ${bgColor} rounded-lg flex items-center justify-center`}
    >
      <Icon className={`h-6 w-6 ${iconColor}`} />
    </div>
  );
};

export const PricingSection = () => {
  return (
    <section
      id="pricing"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Flexible plans for every need</h2>
          <p className="mt-4 text-muted-foreground">
            Choose the plan that best fits your needs. Whether you're just
            getting started or managing large projects
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PRICING.map((price) => (
            <div
              key={price.plan}
              className={cn(
                "bg-background p-8 rounded-xl shadow-sm",
                price.plan === "Pro" &&
                  "border-2 border-black dark:border-backgroundPrimary relative"
              )}
            >
              {price.plan === "Pro" && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black dark:bg-backgroundPrimary text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{price.plan} Plan</h3>
                <IconVariant plan={price.plan.toLowerCase() as PlanType} />
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {price.plan !== "Starter" && "$"}
                  {price.price}
                </span>
                {price.plan !== "Starter" && (
                  <span className="text-gray-500">/month</span>
                )}
              </div>
              <ul className="space-y-4 mb-8">
                {price.features.map((feature) => (
                  <li key={price.plan + feature} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-backgroundPrimary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={price.plan === "Pro" ? "default" : "outline"}
                className={cn(
                  "w-full py-6",
                  price.plan === "Pro" &&
                    "dark:bg-backgroundPrimary dark:text-white"
                )}
              >
                <Link
                  href={
                    price.plan === "Starter" ? "/api/auth/login" : "/billing"
                  }
                >
                  {price.plan === "Starter" ? "Start Free" : "Upgrade Now"}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
