import {
  BarChart,
  Calendar,
  CheckCircle,
  File,
  Kanban,
  ListTodo,
  Lock,
  MessageSquare,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";

import { Card } from "../ui/card";

export const CoreFeatureSection = () => {
  return (
    <div className="bg-background py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
            <p className="text-gray-600 mb-4">
              Empower your projects with real-time updates and efficient project
              tracking when working with others
            </p>
          </Card>

          <Card className="feature-card">
            <div className="h-12 w-12 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">All-in-One Solution</h3>
            <p className="text-gray-600 mb-4">
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
            <p className="text-gray-600 mb-4">
              Personalize your workspace with flexible tools designed to match
              your unique work style
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const KeyFeaturesSection = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">
            Key features to boost your productivity
          </h2>
          <p className="mt-4 text-muted-foreground">
            Explore the essential tools designed to streamline your workflow and
            ensure your projects run smoothly from start to finish
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative hover:scale-105 transition-all duration-500">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-500">
              01
            </div>
            <Image
              src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              alt="To-do List Feature"
              width={400}
              height={400}
              className="rounded-xl shadow-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">To-do List</h3>
            <p className="text-muted-foreground">
              Organize your daily tasks effortlessly with our intuitive to-do
              list. Stay focused and prioritize what matters most.
            </p>
          </div>

          <div className="relative hover:scale-105 transition-all duration-500">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-500">
              02
            </div>
            <Image
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              alt="Project Tracking Feature"
              width={400}
              height={400}
              className="rounded-xl shadow-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Project Tracking</h3>
            <p className="text-muted-foreground">
              Monitor project timelines and milestones in real-time. Meet your
              deadlines with confidence.
            </p>
          </div>

          <div className="relative hover:scale-105 transition-all duration-500">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-500">
              03
            </div>
            <Image
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              alt="Team Collaboration Feature"
              width={400}
              height={400}
              className="rounded-xl shadow-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">
              Optional Collaboration
            </h3>
            <p className="text-muted-foreground">
              Easily share projects and collaborate when needed, while
              maintaining your personal workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PowerfulFeaturesSection = () => {
  return (
    <div className="bg-background py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">
            Powerful Features to Elevate Your Workflow
          </h2>
          <p className="mt-4 text-muted-foreground">
            Explore advanced tools that help you make smarter decisions, track
            progress, and manage your tasks with ease
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="powerful-feature-card">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Decisions</h3>
            <p className="text-muted-foreground">
              Get real-time insights and metrics to help you make more informed
              decisions
            </p>
          </div>

          <div className="powerful-feature-card">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Goal Tracking</h3>
            <p className="text-muted-foreground">
              Set and optimize personal goals with smart progress tracking
            </p>
          </div>

          <div className="powerful-feature-card">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <ListTodo className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Task Management</h3>
            <p className="text-muted-foreground">
              Organize tasks with priorities and deadlines for smooth execution
            </p>
          </div>

          <div className="powerful-feature-card">
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Communication</h3>
            <p className="text-muted-foreground">
              Built-in messaging for seamless collaboration when needed
            </p>
          </div>
          <div className="powerful-feature-card">
            <div className="h-12 w-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <File className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Documentation</h3>
            <p className="text-muted-foreground">
              Built-in documentation for seamless collaboration when needed
            </p>
          </div>
          <div className="powerful-feature-card">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Project Access Level</h3>
            <p className="text-muted-foreground">
              Set the access level for your project and who can see it
            </p>
          </div>
          <div className="powerful-feature-card">
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Kanban className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Kanban Board</h3>
            <p className="text-muted-foreground">
              Visualize your project with a kanban board with easy drag and drop
              functionality
            </p>
          </div>
          <div className="powerful-feature-card">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Gantt Chart & Calendar
            </h3>
            <p className="text-muted-foreground">
              Visualize your project with a gantt chart and an interactive
              calendar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};