"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Bell } from "lucide-react";

import { useURLPathName } from "@/hooks/use-pathname";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ProfileAvatar } from "./user-avatar";
import Link from "next/link";

interface UserProps {
  id: string;
  name: string;
  email: string;
  image?: string;
  totalUnreadNotifications: number;
}

export const Navbar = ({
  id,
  name,
  email,
  image,
  totalUnreadNotifications,
}: UserProps) => {
  const path = useURLPathName();

  return (
    <nav className="w-full flex items-start justify-between py-3 px-4 sticky top-0 bg-background z-50">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-2xl font-semibold capitalize">
          {path?.label}
        </h1>
        <p className="text-xs md:text-sm text-gray-500">{path?.description}</p>
      </div>

      <div className="flex items-center md:gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
          </Link>
          {totalUnreadNotifications > 0 && (
            <p className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
              {totalUnreadNotifications}
            </p>
          )}
        </Button>

        <ThemeToggle />

        <Popover>
          <PopoverTrigger>
            <ProfileAvatar
              url={image || undefined}
              name={name}
              size="lg"
              className="!rounded-full !size-8 md:!size-10 !bg-blue-600 !text-white"
            />
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="flex flex-col gap-2 items-center mb-3">
              <ProfileAvatar url={image} name={name} />
              <div className="text-center">
                <h3 className="text-base font-semibold text-muted-foreground">
                  {name}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-1">{email}</p>
              </div>
            </div>

            <Separator />

            <Button className="w-full bg-destructive/20 mt-6 text-destructive dark:text-red-600 hover:bg-destructive hover:text-white">
              <LogoutLink>Sign Out</LogoutLink>
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};
