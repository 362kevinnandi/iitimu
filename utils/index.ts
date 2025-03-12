import { TaskStatus } from "@prisma/client";
import { Users } from "lucide-react";

export const roleList = [
  "Designer",
  "Developer",
  "Founder",
  "Project Manager",
  "Product Manager",
  "QA Analyst",
  "Team Member",
  "Tester",
  "UX Designer",
  "Others",
];

export const industryTypesList = [
  "Consumer Goods",
  "Education",
  "Finance",
  "Government",
  "Healthcare",
  "Manufacturing",
  "Marketing",
  "Retail",
  "Technology",
  "Others",
];

export const PRICING = [
  {
    plan: "Starter",
    price: "Free",
    icon: Users,
    features: [
      "1 Workspace",
      "Up to 10 Projects Per Workspace",
      "Up to 10 Tasks Per Project",
      "Team Collaboration (Up to 2 Members)",
    ],
    isDefault: false,
  },
  {
    plan: "Pro",
    price: "5.99",
    icon: Users,
    features: [
      "Up to 10 Workspaces",
      "Unlimited Projects",
      "Unlimited Tasks",
      "Team Collaboration (Up to 20 Members)",
      "Calendar View",
      "Project Timeline (Gantt Chart)",
      "File Storage (10 Files Per Task)",
    ],
    isDefault: true,
  },
  {
    plan: "Enterprise",
    price: "20",
    icon: Users,
    features: [
      "Everything in Pro Plan",
      "Unlimited Workspaces",
      "Unlimited Team Collaboration",
      "Unlimited File Storage (Fair-use Policy Applies)",
    ],
    isDefault: false,
  },
];

export const testimonies = [
  {
    id: "01",
    name: "Rcokson Ohene Asante",
    review:
      "TM-iitimu has completely changed how our team collaborates. It's intuitive and has made tracking projects so much easier",
    rating: 5,
    role: "CEO at S-REC",
  },
  {
    id: "02",
    name: "Daniel Okyere Konadu",
    review:
      "Easily share projects and collaborate when needed, while maintaining your personal workspace.",
    rating: 4.5,
    role: "Marketing Manager, MyCribe",
  },
  {
    id: "03",
    name: "Huseini Kamara",
    review:
      "TM-iitimu has been the go-to tool for organizing my projects and tasks. I love how it allows me to stay focused and achieve more with my personal command center.",
    rating: 4,
    role: "Operations Manager, S-REC",
  },
];

export const generateInviteCode = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let inviteCode = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    inviteCode += characters[randomIndex];
  }

  return inviteCode;
};

export const taskStats = [
  {
    status: TaskStatus.TODO,
    label: "TO DO",
    color: "bg-blue-500",
  },
  {
    status: TaskStatus.IN_PROGRESS,
    label: "IN PROGRESS",
    color: "bg-yellow-500",
  },
  {
    status: TaskStatus.COMPLETED,
    label: "COMPLETED",
    color: "bg-green-500",
  },
  {
    status: TaskStatus.BLOCKED,
    label: "BLOCKED",
    color: "bg-red-500",
  },
  {
    status: TaskStatus.BACKLOG,
    label: "BACKLOG",
    color: "bg-gray-500",
  },
  {
    status: TaskStatus.IN_REVIEW,
    label: "IN REVIEW",
    color: "bg-blue-500",
  },
];

export const taskStatusVariant = {
  [TaskStatus.BLOCKED]: "#ef4444",
  [TaskStatus.TODO]: "#6366f1",
  [TaskStatus.IN_PROGRESS]: "#f59e0b",
  [TaskStatus.COMPLETED]: "#10b981",
  [TaskStatus.BACKLOG]: "#ec4899",
  [TaskStatus.IN_REVIEW]: "#a855f7",
  default: "#6366f1",
};
