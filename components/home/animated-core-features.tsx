import { BarChart, CheckCircle, Users } from "lucide-react";

import { Card } from "../ui/card";

export const AnimatedCoreFeatureSection = () => {
  return (
    <div className="bg-gradient-to-b from-background via-slate-300 dark:via-slate-800 to-background py-20 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            className="animate-draw-arc"
            d="M50 300 C 300 300, 500 100, 600 100 C 700 100, 900 300, 1150 300"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="3"
            fill="none"
          />
          <circle className="animate-move-dot" r="10" fill="#3B82F6">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              path="M50 300 C 300 300, 500 100, 600 100 C 700 100, 900 300, 1150 300"
            />
          </circle>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">
            Essential features for personal success
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to simplify your projects and boost productivity
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="feature-card">
            <div className="h-12 w-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Seamless Collaboration
            </h3>
            <p className="text-muted-foreground mb-4">
              Empower your projects with real-time updates and efficient project
              tracking when working with others
            </p>
          </Card>

          <Card className="feature-card">
            <div className="h-12 w-12 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">All-in-One Solution</h3>
            <p className="text-muted-foreground mb-4">
              Manage everything from tasks to goals in one integrated workspace
              designed to boost productivity
            </p>
          </Card>

          <Card className="feature-card">
            <div className="h-12 w-12 bg-amber-600/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="h-6 w-6 text-amber-600" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Customizable Workflow
            </h3>
            <p className="text-muted-foreground mb-4">
              Personalize your workspace with flexible tools designed to match
              your unique work style
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
