import { $Enums } from "@prisma/client";
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  about: z.string().optional(),
  country: z.string().min(1, { message: "Country is required." }),
  industryType: z.string().min(1, { message: "Industry type is required." }),
  role: z.string().min(1, { message: "Role is required" }),
  email: z.string().email({ message: "Invalid email address." }).optional(),
});

export const workspaceSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Workspace name must be at least 3 characters." }),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Workspace name must be at least 3 characters." }),
  description: z.string().optional(),
  workspaceId: z.string(),
  memberAccess: z.array(z.string()).optional(),
});

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "COMPLETED",
    "BLOCKED",
    "BACKLOG",
    "IN_REVIEW",
  ]),
  dueDate: z.date(),
  startDate: z.date(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        type: z.enum(["IMAGE", "PDF"]),
      })
    )
    .optional(),
});
