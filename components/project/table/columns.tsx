import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ProfileAvatar } from "@/components/user-avatar";
import { ProjectAvatar } from "../project-avatar";
import Link from "next/link";
import { Project } from "@prisma/client";
import { ArrowUpDown, EllipsisVertical, File, Paperclip } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditTaskDialog } from "../edit-task-dialog ";
import { DeleteTask } from "@/components/task/delete-task";
import { Checkbox } from "@/components/ui/checkbox";

export type TaskTableItem = {
  id: string;
  name: string;
  status: string;
  dueDate: Date;
  assignedTo: {
    name: string;
    image?: string;
  };
  project: Project;
};

export const columns: ColumnDef<TaskTableItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Title
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <Link
          href={`/workspace/${row.original.project.workspaceId}/projects/${row.original.project.id}/${row.original.id}`}
        >
          <div className="flex items-center gap-2">
            <ProjectAvatar name={row.getValue("title")} />
            <span className="text-sm font-medium xl:text-base capitalize">
              {title}
            </span>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status as any}>
          {status === "IN_PROGRESS" ? "IN PROGRESS" : status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <Badge variant={"secondary"} className="font-normal">
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return <div>{format(new Date(createdAt), "MMM dd, yyyy")}</div>;
    },
  },
  {
    accessorKey: "dueDate",

    header: "Due Date",
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as Date;
      return <div>{format(new Date(date), "MMM dd, yyyy")}</div>;
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo") as {
        name: string;
        image?: string;
      };
      return (
        <div className="flex items-center gap-2">
          <ProfileAvatar
            name={assignedTo?.name || "Unassigned"}
            url={assignedTo?.image}
          />
          <span>{assignedTo?.name || "Unassigned"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "attachments",
    header: "Attachments",
    cell: ({ row }) => {
      const attachments = row.getValue("attachments") as string[];
      return (
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4" />
          {attachments.length}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link
                  href={`/workspace/${row.original.project.workspaceId}/projects/${row.original.project.id}/${row.original.id}`}
                >
                  View Task
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <DeleteTask taskId={row.original.id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export const myTaskColumns: ColumnDef<TaskTableItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Title
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <Link
          href={`/workspace/${row.original.project.workspaceId}/projects/${row.original.project.id}/${row.original.id}`}
        >
          <div className="flex items-center gap-2">
            <ProjectAvatar name={row.getValue("title")} />
            <span className="text-sm font-medium xl:text-base capitalize">
              {title}
            </span>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status as any}>
          {status === "IN_PROGRESS" ? "IN PROGRESS" : status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <Badge variant={"secondary"} className="font-normal">
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return <div>{format(new Date(createdAt), "MMM dd, yyyy")}</div>;
    },
  },
  {
    accessorKey: "dueDate",

    header: "Due Date",
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as Date;
      return <div>{format(new Date(date), "MMM dd, yyyy")}</div>;
    },
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => {
      const project = row.getValue("project") as {
        name: string;
      };
      return (
        <Link
          href={`/workspace/${row.original.project.workspaceId}/projects/${row.original.project.id}`}
        >
          <div className="flex items-center gap-2">
            <ProjectAvatar name={project?.name} />
            <span>{project?.name}</span>
          </div>
        </Link>
      );
    },
  },

  {
    accessorKey: "attachments",
    header: "Attachments",
    cell: ({ row }) => {
      const attachments = row.getValue("attachments") as string[];
      return (
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4" />
          {attachments.length}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link
                  href={`/workspace/${row.original.project.workspaceId}/projects/${row.original.project.id}/${row.original.id}`}
                >
                  View Task
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <DeleteTask taskId={row.original.id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
