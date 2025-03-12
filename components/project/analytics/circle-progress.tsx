"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CircleProgressProps {
  title: string;
  value: number;
  subtitle: string;
  variant?: "default" | "success" | "warning" | "inProgress";
  isShowPercentage?: boolean;
}

const variantStyles = {
  default: "text-blue-500",
  success: "text-green-600",
  warning: "text-red-600",
  inProgress: "text-yellow-600",
};

export function CircleProgress({
  title,
  value,
  subtitle,
  variant = "default",
  isShowPercentage = true,
}: CircleProgressProps) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        {title}
      </h3>
      <div className="relative w-20 h-20">
        <Progress
          value={value}
          className={cn(`h-20 w-20 rotate-[-90deg] ${variantStyles[variant]}`)}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-2xl font-bold", variantStyles[variant])}>
            {isShowPercentage ? `${Math.round(value || 0)}%` : ""}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
      </div>
    </div>
  );
}
