import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingCardProps {
  plan: {
    plan: string;
    price: string;
    features: string[];
    isDefault?: boolean;
  };
  isCurrentPlan?: boolean;
  onSelect: () => void;
  loading?: boolean;
}

const PricingCard = ({
  plan,
  isCurrentPlan,
  onSelect,
  loading,
}: PricingCardProps) => {
  return (
    <div
      className={`rounded-lg border p-6 ${plan.isDefault ? "border-primary ring-2 ring-primary" : "border-border"}`}
    >
      {plan.isDefault && (
        <span className="inline-block px-4 py-1 text-sm font-semibold text-primary bg-primary/10 rounded-full mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold">{plan.plan}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-4xl font-bold">${plan.price}</span>
        <span className="ml-1 text-gray-500">/month</span>
      </div>
      <ul className="mt-6 space-y-4">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-5 w-5 text-primary mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className="w-full mt-8"
        variant={isCurrentPlan ? "secondary" : "default"}
        disabled={isCurrentPlan}
        onClick={onSelect || loading}
      >
        {isCurrentPlan ? "Current Plan" : "Upgrade"}
      </Button>
    </div>
  );
};

export default PricingCard;
