"use client";

import { format, getDay, parse, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { toast } from "sonner";

import { moveTaskToNewDate } from "@/app/actions/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useProjectId } from "@/hooks/use-project-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { ProjectTaskProps } from "@/types/task";
import { ProfileAvatar } from "../user-avatar";
import { ProjectAvatar } from "./project-avatar";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { taskStatusVariant } from "@/utils";
import { TaskStatus } from "@prisma/client";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  tasks: ProjectTaskProps[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const DnDCalendar = withDragAndDrop(Calendar);
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();

  const events = tasks?.map((task) => ({
    id: task.id,
    title: task.title,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    status: task.status,
    assignedTo: task.assignedTo,
    project: task.project,
  }));

  const handleEventDrop = async ({ event, start, end }: any) => {
    try {
      await moveTaskToNewDate(event.id, start);
      router.refresh();
      toast.success("Task moved successfully");
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error(error?.message || "Failed to move task");
      }
    }
  };

  const handleSelectEvent = (event: any) => {
    router.push(`/workspace/${workspaceId}/projects/${projectId}/${event.id}`);
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#3498db";
    let borderRight = "3px solid orange";

    if (event.status === "COMPLETED") {
      borderRight =
        "3px solid " + taskStatusVariant[event.status as TaskStatus];
    }
    if (event.status === "IN_REVIEW") {
      borderRight =
        "3px solid " + taskStatusVariant[event.status as TaskStatus];
    }
    if (event.status === "IN_PROGRESS") {
      borderRight =
        "3px solid " + taskStatusVariant[event.status as TaskStatus];
    }
    if (event.status === "TODO") {
      borderRight =
        "3px solid " + taskStatusVariant[event.status as TaskStatus];
    }
    if (event.status === "BLOCKED") {
      borderRight =
        "3px solid " + taskStatusVariant[event.status as TaskStatus];
    }
    if (event.status === "BACKLOG") {
      borderRight =
        "3px solid " + taskStatusVariant[event.status as TaskStatus];
    }

    return {
      style: {
        backgroundColor: "transparent",
        borderRadius: "5px",
        opacity: 0.8,
        color: "black",
        borderRight,
        display: "block",
      },
    };
  };

  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const currentMonth = format(toolbar.date, "MMMM yyyy");

    return (
      <div className="flex items-center justify-between mb-4">
        <button onClick={goToBack} className="p-2 hover:bg-muted rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-lg font-semibold">{currentMonth}</span>
        <button onClick={goToNext} className="p-2 hover:bg-muted rounded-full">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  const CustomEvent = ({ event }: any) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="h-full w-full p-1">
          <div className="flex items-center gap-2">
            <ProjectAvatar
              name={event.project.name}
              className="!size-5 !text-sm"
            />

            <p className="text-sm text-muted-foreground">{event.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <ProfileAvatar
              url={event.assignedTo.image || undefined}
              name={event.assignedTo.name}
              className="!size-5 !rounded"
            />
            <p className="text-xs text-muted-foreground">
              {event.assignedTo.name.split(" ")[0]}
            </p>
          </div>
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="w-80 bg-background z-50">
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">{event.title}</h4>
          <p className="text-sm text-muted-foreground">
            Due: {format(new Date(event.end), "MMM dd, yyyy")}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Assigned to:</span>
            {event.assignedTo ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={event.assignedTo.image} />
                  <AvatarFallback>{event.assignedTo.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{event.assignedTo.name}</span>
              </div>
            ) : (
              <span className="text-sm">Unassigned</span>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  return (
    <div className="h-screen px-2 md:p-4 overflow-x-auto w-full">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor={(event: any) => event.start}
        endAccessor={(event: any) => event.end}
        style={{ height: "100%" }}
        eventPropGetter={eventStyleGetter}
        onEventDrop={handleEventDrop}
        onSelectEvent={handleSelectEvent}
        components={{
          event: CustomEvent,
          toolbar: CustomToolbar,
        }}
        views={["month"]}
        defaultView="month"
        selectable
        resizable
        className="text-foreground overflow-auto"
      />
    </div>
  );
}
