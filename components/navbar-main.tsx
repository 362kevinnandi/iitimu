"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useURLPathName } from "@/hooks/use-pathname";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { CheckSquare, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
export const NavMain = () => {
  const workspaceId = useWorkspaceId();
  const path = useURLPathName();
  const { setOpenMobile } = useSidebar();

  const items = [
    {
      label: "Home",
      href: `/workspace/${workspaceId}`,
      icon: LayoutDashboard,
      path: "home",
    },
    {
      label: "My Tasks",
      href: `/workspace/${workspaceId}/my-tasks`,
      icon: CheckSquare,
      path: "my-tasks",
    },

    {
      label: "Members",
      href: `/workspace/${workspaceId}/members`,
      icon: Users,
      path: "members",
    },
    {
      label: "Settings",
      href: `/workspace/${workspaceId}/settings`,
      icon: Settings,
      path: "settings",
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu className="space-y-3">
        {items.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              asChild
              tooltip={item.label}
              className={cn(path?.label === item.path && "sidebar-active")}
            >
              <Link href={item.href} onClick={() => setOpenMobile(false)}>
                <item.icon className="mr-2 h-4 w-4" />

                {item.label}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
