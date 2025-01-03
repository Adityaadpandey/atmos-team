"use client";

import { getAllTaskAndSubTask, updateStatusofTask } from "@/actions/task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Task } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BarChart2,
  Calendar,
  CheckCircle2,
  CircleDashed,
  Clock,
  Plus,
  RotateCcw,
  Timer,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ITEM_TYPE = "TASK";

type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "BACKLOG";

const StatusIcon = ({ status }: { status: TaskStatus }) => {
  const icons = {
    TODO: <CircleDashed className="h-5 w-5" />,
    IN_PROGRESS: <Timer className="h-5 w-5" />,
    COMPLETED: <CheckCircle2 className="h-5 w-5" />,
    BACKLOG: <RotateCcw className="h-5 w-5" />,
  };
  return icons[status];
};

const DraggableTask = ({ task }: { task: Task }) => {
  const router = useRouter();
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: task,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const cardStyles: Record<TaskStatus, string> = {
    TODO: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40",
    IN_PROGRESS:
      "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40",
    COMPLETED:
      "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40",
    BACKLOG:
      "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/40",
  };

  const progressColors: Record<TaskStatus, string> = {
    TODO: "bg-blue-500",
    IN_PROGRESS: "bg-amber-500",
    COMPLETED: "bg-green-500",
    BACKLOG: "bg-red-500",
  };

  const deadline = new Date(task.deadline);
  const isOverdue = deadline < new Date();

  // TODO: Make some actual progress calculation

  const progress: Record<TaskStatus, string> = {
    TODO: "0",
    IN_PROGRESS: "50",
    COMPLETED: "100",
    BACKLOG: "-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        ref={dragRef}
        className={`group p-4 ${cardStyles[task.status as TaskStatus]} cursor-move rounded-xl border-none backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 ${isDragging ? "rotate-3 opacity-50" : "opacity-100"}`}
        onClick={() => router.push(`/dashboard/task/${task.id}`)}
      >
        {/* Status and Priority Banner */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon status={task.status as TaskStatus} />
            <span className="text-sm font-medium text-muted-foreground">
              {task.status.replace("_", " ")}
            </span>
          </div>
          {isOverdue && (
            <div className="flex items-center gap-1 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">Overdue</span>
            </div>
          )}
        </div>

        {/* Task Title */}
        <h3 className="mb-2 truncate text-lg font-semibold tracking-tight">
          {task.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {task.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>
              {Math.round(Number(progress[task.status as TaskStatus]))}%
            </span>
          </div>
          <Progress
            value={Number(progress[task.status as TaskStatus])}
            className={progressColors[task.status as TaskStatus]}
          />
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3">
          {/* Deadline */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(task.deadline).toLocaleString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Assignees */}
          {task.assignees.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {task.assignees.map((assignee) => (
                  <Badge
                    key={assignee.id}
                    variant="secondary"
                    className="px-2 py-0 text-xs"
                  >
                    {assignee.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

const TaskColumn = ({
  title,
  tasks,
  status,
  onMoveTask,
}: {
  title: string;
  tasks: Task[];
  status: string;
  onMoveTask: (task: Task, newStatus: string) => void;
}) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: Task) => onMoveTask(item, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const columnStyles: Record<string, string> = {
    TODO: "border-blue-200 dark:border-blue-800",
    IN_PROGRESS: "border-amber-200 dark:border-amber-800",
    COMPLETED: "border-green-200 dark:border-green-800",
    BACKLOG: "border-red-200 dark:border-red-800",
  };

  return (
    <div
      ref={dropRef}
      className={`rounded-xl border-2 ${columnStyles[status]} ${isOver ? "ring-2 ring-primary" : ""
        } bg-background/50 backdrop-blur-sm transition-all duration-300`}
    >
      <div className="p-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Badge variant="secondary">{tasks.length}</Badge>
        </div>
        <div className="space-y-4">
          <AnimatePresence>
            {tasks.map((task) => (
              <DraggableTask key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const DashboardContent = () => {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) {
        setError("User ID is not available.");
        setLoading(false);
        return;
      }

      try {
        const data = await getAllTaskAndSubTask(userId);
        console.log(data);
        setTasks(data.tasks as Task[]);
      } catch {
        setError("An error occurred while fetching tasks and subtasks.");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && userId) {
      fetchTasks();
    }
  }, [isLoaded, userId]);

  const moveTask = (task: Task, newStatus: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === task.id ? { ...t, status: newStatus } : t,
      ),
    );
    updateStatusofTask(task.id, newStatus as TaskStatus);
  };

  const tasksByStatus = useMemo(
    () => ({
      todo: tasks.filter((task) => task.status === "TODO"),
      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS"),
      completed: tasks.filter((task) => task.status === "COMPLETED"),
      backlog: tasks.filter((task) => task.status === "BACKLOG"),
    }),
    [tasks],
  );
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasksByStatus.completed.length;
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
  }, [tasks, tasksByStatus]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-lg text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-red-500">
          <AlertCircle className="h-16 w-16" />
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/80">
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
        {/* Dashboard Header Section */}
        <div className="relative rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Task Dashboard
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Manage and track your tasks efficiently. Drag and drop tasks
                  between columns to update their status.
                </p>
              </div>

              {/* TODO: add a create task part */}
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => router.push("/dashboard/task/createTask")}
              >
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                    <p className="font-medium">{stats.total}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="font-medium">{stats.completed}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Upcoming Deadlines
                    </p>
                    <p className="font-medium">{stats.upcoming}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <BarChart2 className="h-5 w-5 text-muted-foreground" />
                  <div className="w-full">
                    <p className="text-sm text-muted-foreground">
                      Overall Progress
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress value={stats.progress} className="flex-1" />
                      <span className="text-sm font-medium">
                        {Math.round(stats.progress)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

const Page = () => (
  <DndProvider backend={HTML5Backend}>
    <DashboardContent />
  </DndProvider>
);

export default Page;
