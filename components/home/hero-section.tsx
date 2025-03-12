import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

import { Button } from "../ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

export const HeroSection = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isLoggedIn = await isAuthenticated();

  return (
    <div className="pt-32 lg:pt-64 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <p> Your personal workspace </p>
            <p className="text-5xl md:text-6xl">
              for{" "}
              <span className="text-backgroundPrimary">
                better productivity
              </span>
            </p>
          </h1>
          <p className="mt-6 text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Organize your projects, tasks, and goals in one place. Stay focused
            and achieve more with your personal command center.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            {isLoggedIn ? (
              <Button size="lg" asChild>
                <Link href="/workspace">View Workspace</Link>
              </Button>
            ) : (
              <>
                <Button size={"lg"} className="py-6" asChild>
                  <RegisterLink>Start for Free</RegisterLink>
                </Button>
                <Button size={"lg"} variant={"ghost"} className="py-6">
                  Watch Demo
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
