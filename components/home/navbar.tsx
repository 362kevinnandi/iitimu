import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Cloud } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";

export const HomeNavbar = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isLoggedIn = await isAuthenticated();

  return (
    <nav className="fixed w-full bg-background backdrop-blur-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Cloud className="h-8 w-8 text-backgroundPrimary" />
            <span className="ml-2 text-xl font-bold">MT -</span>
            <span className="text-backgroundPrimary text-xl font-bold">iitimu</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-foreground">
            <Link href="/">Home</Link>
            <div className="relative group">
              <Link href="#features">Features</Link>
            </div>
            <Link href="#pricing">Pricing</Link>
            <Link href="mailto:codewavewithasante@gmail.com">Contact</Link>
          </div>

          <div className="flex items-center md:space-x-4">
            <ThemeToggle />
            {isLoggedIn ? (
              <Button asChild variant={"ghost"}>
                <LogoutLink>Sign Out</LogoutLink>
              </Button>
            ) : (
              <>
                <Button variant={"ghost"} className="" asChild>
                  <LoginLink>Sign In</LoginLink>
                </Button>
                <Button className="py-5 hidden md:flex">
                  <RegisterLink>Get Started</RegisterLink>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
