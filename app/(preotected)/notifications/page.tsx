import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  AtSign,
  Bell,
  CheckSquare,
  Clock,
  ExternalLink,
  MessageSquare,
  Users,
} from "lucide-react";
import Link from "next/link";

import { getNotifications } from "@/app/data/user/get-notifications";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";

const notificationIcons = {
  [NotificationType.COMMENT]: MessageSquare,
  [NotificationType.TIME_LOG]: Clock,
  [NotificationType.MENTION]: AtSign,
  [NotificationType.TASK_ASSIGNMENT]: CheckSquare,
  [NotificationType.WORKSPACE_INVITE]: Users,
  [NotificationType.SYSTEM_MESSAGE]: Bell,
};

const NotificationsPage = async () => {
  const { notifications } = await getNotifications();

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/workspace">
          <ArrowLeft className="size-4 lg:size-6" />
        </Link>
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {!notifications ? (
          <div className="text-center text-muted-foreground py-8">
            No notifications yet
          </div>
        ) : (
          notifications?.map((notification) => {
            const Icon = notificationIcons[notification?.type];
            const isTaskLink = notification.link?.startsWith("task-");

            return (
              <AccordionItem
                key={notification.id}
                value={notification.id}
                className={cn(
                  "border p-4 rounded-lg",
                  !notification.read && "bg-muted/30"
                )}
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-start gap-4 w-full">
                    <Icon className="w-5 h-5 mt-1 text-muted-foreground" />
                    <div className="flex-1 text-left">
                      <div className="line-clamp-1">{notification.message}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-4">
                  <div className="ml-9">
                    <p className="whitespace-pre-wrap">
                      {notification.message}
                    </p>
                    {isTaskLink && notification?.link && (
                      <Link
                        href={`/tasks/${notification?.link.replace("task-", "")}`}
                        className="flex items-center gap-2 text-primary hover:underline mt-4"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Task
                      </Link>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })
        )}
      </Accordion>
    </div>
  );
};

export default NotificationsPage;
