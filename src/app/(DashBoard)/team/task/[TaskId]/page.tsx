// pages/task/[id].tsx
"use client";

import { getTaskById, updateStatusofSubTask } from "@/actions/task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SubTask, TaskMain, TaskStatus } from "@/types";
import {
  AlertCircle,
  BarChart2,
  Calendar,
  Clock,
  Plus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SubTaskColumn } from "../../_components/TaskColumn";
import CommentSection from "./comments";
import LoadingScreen from "@/components/globals/loadingScreen";

const SUBTASK_ITEM_TYPE = "SUBTASK";

export default function TaskPage({
  params,
}: {
  params: Promise<{ TaskId: string }>;
}) {
  const { TaskId } = use(params);
  const router = useRouter();
  const [task, setTask] = useState<TaskMain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTaskById(TaskId);
        setTask(response as TaskMain);
      } catch {
        setError("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [TaskId]);

  const subtasksByStatus = useMemo(() => {
    if (!task?.subTasks) return {};
    return {
      todo: task.subTasks.filter(
        (subtask: SubTask) => subtask.status === "TODO",
      ),
      inProgress: task.subTasks.filter(
        (subtask: SubTask) => subtask.status === "IN_PROGRESS",
      ),
      completed: task.subTasks.filter(
        (subtask: SubTask) => subtask.status === "COMPLETED",
      ),
      backlog: task.subTasks.filter(
        (subtask: SubTask) => subtask.status === "BACKLOG",
      ),
    };
  }, [task?.subTasks]);

  const taskProgress = useMemo(() => {
    if (!task?.subTasks?.length) return 0;
    const completedTasks = task.subTasks.filter(
      (subtask: SubTask) => subtask.status === "COMPLETED",
    ).length;
    return Math.round((completedTasks / task.subTasks.length) * 100);
  }, [task?.subTasks]);

  const moveSubtask = async (subtask: SubTask, newStatus: string) => {
    if (!task) return;

    setTask((prevTask: any) => {
      if (!prevTask) return null;
      return {
        ...prevTask,
        subTasks: prevTask.subTasks?.map((st) =>
          st.id === subtask.id ? { ...st, status: newStatus } : st,
        ),
      };
    });

    await updateStatusofSubTask(subtask.id, newStatus as TaskStatus);
  };

  if (loading) {
    <LoadingScreen />;
  }

  if (error || !task) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-background to-background/80">
        <div className="flex flex-col items-center gap-4 text-red-500">
          <AlertCircle className="h-16 w-16" />
          <p className="text-lg">{error || "Task not found"}</p>
        </div>
      </div>
    );
  }

  const isOverdue = new Date(task.deadline) < new Date();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/80">
        <div className="mx-auto max-w-7xl p-6">
          {/* Enhanced Header Section */}
          <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {task.title}
                  </h1>
                  <p className="max-w-2xl text-lg text-muted-foreground">
                    {task.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 shadow-sm transition-all hover:shadow-md"
                  onClick={() => router.push(`/team/task/${TaskId}/subtask`)}
                >
                  <Plus className="h-5 w-5" />
                  Add Subtask
                </Button>
              </div>

              {/* Enhanced Meta Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-background/60 backdrop-blur-sm transition-all hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-6">
                    <Calendar className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Deadline
                      </p>
                      <p
                        className={`text-lg font-semibold ${isOverdue ? "text-red-500" : "text-foreground"}`}
                      >
                        {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/60 backdrop-blur-sm transition-all hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-6">
                    <Clock className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Created
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/60 backdrop-blur-sm transition-all hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-6">
                    <Users className="h-8 w-8 text-primary" />
                    <div className="w-full">
                      <p className="text-sm font-medium text-muted-foreground">
                        Assignees
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {task.assignees.map((assignee: any) => (
                          <Badge
                            key={assignee.id}
                            variant="secondary"
                            className="px-3 py-1 text-sm font-medium"
                          >
                            {assignee.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-background/60 backdrop-blur-sm transition-all hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-6">
                    <BarChart2 className="h-8 w-8 text-primary" />
                    <div className="w-full">
                      <p className="text-sm font-medium text-muted-foreground">
                        Progress
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={taskProgress} className="h-2 flex-1" />
                        <span className="text-lg font-semibold text-foreground">
                          {taskProgress}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Main Task Columns */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SubTaskColumn
                  title="To Do"
                  tasks={subtasksByStatus.todo || []}
                  status="TODO"
                  onMoveTask={moveSubtask}
                  itemType={SUBTASK_ITEM_TYPE}
                />
                <SubTaskColumn
                  title="In Progress"
                  tasks={subtasksByStatus.inProgress || []}
                  status="IN_PROGRESS"
                  onMoveTask={moveSubtask}
                  itemType={SUBTASK_ITEM_TYPE}
                />
                <SubTaskColumn
                  title="Completed"
                  tasks={subtasksByStatus.completed || []}
                  status="COMPLETED"
                  onMoveTask={moveSubtask}
                  itemType={SUBTASK_ITEM_TYPE}
                />
              </div>

              {/* Backlog Section */}
              <div className="mt-6">
                <SubTaskColumn
                  title="Backlog"
                  tasks={subtasksByStatus.backlog || []}
                  status="BACKLOG"
                  onMoveTask={moveSubtask}
                  itemType={SUBTASK_ITEM_TYPE}
                />
              </div>
            </div>

            {/* Comment Section Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card className="bg-background/60 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <CommentSection taskId={TaskId} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
