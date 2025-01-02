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
import { use, useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TaskColumn } from "../../_components/TaskColumn";

const SUBTASK_ITEM_TYPE = "SUBTASK";

export default function TaskPage({
  params,
}: {
  params: Promise<{ TaskId: string }>;
}) {
  const { TaskId } = use(params);
  const [task, setTask] = useState<TaskMain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTaskById(TaskId);
        setTask(response);
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
      todo: task.subTasks.filter((subtask) => subtask.status === "TODO"),
      inProgress: task.subTasks.filter(
        (subtask) => subtask.status === "IN_PROGRESS",
      ),
      completed: task.subTasks.filter(
        (subtask) => subtask.status === "COMPLETED",
      ),
      backlog: task.subTasks.filter((subtask) => subtask.status === "BACKLOG"),
    };
  }, [task?.subTasks]);

  const taskProgress = useMemo(() => {
    if (!task?.subTasks?.length) return 0;
    const completedTasks = task.subTasks.filter(
      (subtask) => subtask.status === "COMPLETED",
    ).length;
    return Math.round((completedTasks / task.subTasks.length) * 100);
  }, [task?.subTasks]);

  const moveSubtask = async (subtask: SubTask, newStatus: string) => {
    if (!task) return;

    setTask((prevTask) => {
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
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-background to-background/80">
        <div className="flex flex-col items-center gap-4">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-lg text-muted-foreground">
            Loading task details...
          </p>
        </div>
      </div>
    );
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
        <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
          {/* Task Header Section */}
          <div className="relative rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {task.title}
                  </h1>
                  <p className="mt-2 max-w-2xl text-muted-foreground">
                    {task.description}
                  </p>
                </div>
                {/* TODO: Add a SubTask option */}
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Subtask
                </Button>
              </div>

              {/* Task Meta Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <Card>
                  <CardContent className="flex items-center gap-2 p-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p
                        className={`font-medium ${isOverdue ? "text-red-500" : ""}`}
                      >
                        {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-2 p-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-2 p-4">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Assignees</p>
                      <div className="flex flex-wrap gap-1">
                        {task.assignees.map((assignee) => (
                          <Badge key={assignee.id} variant="secondary">
                            {assignee.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-2 p-4">
                    <BarChart2 className="h-5 w-5 text-muted-foreground" />
                    <div className="w-full">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <div className="flex items-center gap-2">
                        <Progress value={taskProgress} className="flex-1" />
                        <span className="text-sm font-medium">
                          {taskProgress}%
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
              tasks={subtasksByStatus.todo || []}
              status="TODO"
              onMoveTask={moveSubtask}
              itemType={SUBTASK_ITEM_TYPE}
            />
            <TaskColumn
              title="In Progress"
              tasks={subtasksByStatus.inProgress || []}
              status="IN_PROGRESS"
              onMoveTask={moveSubtask}
              itemType={SUBTASK_ITEM_TYPE}
            />
            <TaskColumn
              title="Completed"
              tasks={subtasksByStatus.completed || []}
              status="COMPLETED"
              onMoveTask={moveSubtask}
              itemType={SUBTASK_ITEM_TYPE}
            />
          </div>

          <div className="mt-6">
            <TaskColumn
              title="Backlog"
              tasks={subtasksByStatus.backlog || []}
              status="BACKLOG"
              onMoveTask={moveSubtask}
              itemType={SUBTASK_ITEM_TYPE}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
