"use client";

import useSWR from "swr";
import { getAllTaskAndSubTask, updateStatusofTask } from "@/actions/task";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Task } from "@prisma/client";
import {
  AlertCircle,
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TaskColumn } from "./_components/TaskColumn";

// Create a cache key based on userId

// Fetcher function for SWR
const fetcher = () => getAllTaskAndSubTask();

// Memoized stats calculator
const calculateStats = (tasks: Task[]) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;
  const progressPercentage = totalTasks
    ? (completedTasks / totalTasks) * 100
    : 0;
  const upcomingDeadlines = tasks.filter(
    (task) =>
      new Date(task.deadline) > new Date() && task.status !== "COMPLETED",
  ).length;

  return {
    total: totalTasks,
    completed: completedTasks,
    progress: progressPercentage,
    upcoming: upcomingDeadlines,
  };
};

// Memoized task grouping
const groupTasksByStatus = (tasks: Task[]) => ({
  todo: tasks.filter((task) => task.status === "TODO"),
  inProgress: tasks.filter((task) => task.status === "IN_PROGRESS"),
  completed: tasks.filter((task) => task.status === "COMPLETED"),
  backlog: tasks.filter((task) => task.status === "BACKLOG"),
});

const DashboardContent = () => {
  const router = useRouter();
  // SWR hook for data fetching with caching
  const {
    data: tasks = [],
    error,
    mutate,
  } = useSWR("tasks", fetcher, {
    revalidateOnFocus: false, // Won't refetch when tab regains focus
    revalidateOnReconnect: true, // Will refetch when internet reconnects
    dedupingInterval: 50000, // Prevents duplicate requests within 5 seconds
    keepPreviousData: true, // Shows cached data while fetching new data
  });

  // Memoized calculations
  const tasksByStatus = useMemo(() => groupTasksByStatus(tasks), [tasks]);
  const stats = useMemo(() => calculateStats(tasks), [tasks]);

  // Optimized moveTask function with local state update
  const moveTask = useCallback(
    async (task: Task, newStatus: Task["status"]) => {
      // Optimistic update
      const optimisticData = tasks.map((t) =>
        t.id === task.id ? { ...t, status: newStatus } : t,
      );

      try {
        // Update local state immediately
        await mutate(optimisticData as Task[], false);

        // Update server in background
        await updateStatusofTask(task.id, newStatus);

        // Revalidate after server update
        mutate();
      } catch (error) {
        // Rollback on error
        mutate();
        console.error("Failed to update task status:", error);
      }
    },
    [tasks, mutate],
  );

  const handleCreateTask = useCallback(() => {
    router.push("/team/task/create-task");
  }, [router]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-red-500">
          <AlertCircle className="h-16 w-16" />
          <p className="text-lg">Failed to load tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/80">
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
        {/* Dashboard Header Section */}
        <div className="relative rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Team Task Dashboard
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Manage and track your tasks efficiently. Drag and drop tasks
                  between columns to update their status.
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleCreateTask()}
              >
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <StatCard
                icon={<CheckCircle2 />}
                label="Total Tasks"
                value={stats.total}
              />
              <StatCard
                icon={<Clock />}
                label="Completed"
                value={stats.completed}
              />
              <StatCard
                icon={<Calendar />}
                label="Upcoming Deadlines"
                value={stats.upcoming}
              />
              <ProgressCard value={stats.progress} />
            </div>
          </div>
        </div>

        {/* Task Columns */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <TaskColumn
            title="To Do"
            tasks={tasksByStatus.todo}
            status="TODO"
            onMoveTask={moveTask}
          />
          <TaskColumn
            title="In Progress"
            tasks={tasksByStatus.inProgress}
            status="IN_PROGRESS"
            onMoveTask={moveTask}
          />
          <TaskColumn
            title="Completed"
            tasks={tasksByStatus.completed}
            status="COMPLETED"
            onMoveTask={moveTask}
          />
        </div>

        <div className="mt-6">
          <TaskColumn
            title="Backlog"
            tasks={tasksByStatus.backlog}
            status="BACKLOG"
            onMoveTask={moveTask}
          />
        </div>
      </div>
    </div>
  );
};

// Memoized stat card components
const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <Card>
    <CardContent className="flex items-center gap-2 p-4">
      <div className="h-5 w-5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const ProgressCard = ({ value }: { value: number }) => (
  <Card>
    <CardContent className="flex items-center gap-2 p-4">
      <BarChart2 className="h-5 w-5 text-muted-foreground" />
      <div className="w-full">
        <p className="text-sm text-muted-foreground">Overall Progress</p>
        <div className="flex items-center gap-2">
          <Progress value={value} className="flex-1" />
          <span className="text-sm font-medium">{Math.round(value)}%</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Page = () => (
  <DndProvider backend={HTML5Backend}>
    <DashboardContent />
  </DndProvider>
);

export default Page;
