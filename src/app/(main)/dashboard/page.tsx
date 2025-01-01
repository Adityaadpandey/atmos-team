"use client";

import { getAllTaskAndSubTask, updateStatusofTask } from "@/actions/task";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Task } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ITEM_TYPE = "TASK";

type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "BACKLOG";

const DraggableTask = ({ task }: { task: Task }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: task,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const cardStyles: Record<TaskStatus, string> = {
    TODO: "bg-blue-200 dark:bg-blue-900",
    IN_PROGRESS: "bg-yellow-200 dark:bg-yellow-800",
    COMPLETED: "bg-green-200 dark:bg-green-800",
    BACKLOG: "bg-red-200 dark:bg-red-800",
  };

  const titleStyles = {
    TODO: "text-blue-800 dark:text-blue-100",
    IN_PROGRESS: "text-yellow-800 dark:text-yellow-100",
    COMPLETED: "text-green-800 dark:text-green-100",
    BACKLOG: "text-red-800 dark:text-red-100",
  };




  return (
    <Card
      ref={dragRef}
      className={`p-5 ${cardStyles[task.status as TaskStatus]} cursor-move rounded-xl shadow-md transition-all duration-200 ease-in-out hover:shadow-lg ${isDragging ? "opacity-50" : "opacity-100"}`}
      // TODO: Add onClick event to open task details
      onClick={() => console.log(task.id)}
    >
      <h3
        className={`text-lg font-semibold ${titleStyles[task.status as TaskStatus]}`}
      >
        {task.title}
      </h3>
      <p className="mt-2 ">{task.description}</p>
      {/* <Badge
        variant={task.status.toLowerCase()}
        className="mt-3 text-primary-foreground"
      >
        {task.status}
      </Badge> */}
      <br/>


        {task.assignees.map((assignee) =>
          <Badge key={assignee.id} variant="primary" className="bg-background mx-2">
            {assignee.name}
          </Badge>
        )
        }

    </Card>
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

  return (
    <Card
      ref={dropRef}
      className={`p-6 ${isOver ? "ring-2 ring-primary" : ""}`}
    >
      <h2 className="mb-6 text-center text-2xl font-semibold">{title}</h2>
      <div className="space-y-6">
        {tasks.map((task) => (
          <DraggableTask key={task.id} task={task} />
        ))}
      </div>
    </Card>
  );
};

const DashboardContent = () => {
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

  if (loading)
    return <div className="text-center text-lg text-red-500">Loading...</div>;
  if (error)
    return <div className="text-center text-lg text-red-500">{error}</div>;

  return (
    <Card >
      <div className="flex min-h-screen items-center justify-center bg-background w-full">
        <div className="mx-auto w-full max-w-7xl space-y-10 p-6">
          <h1 className="text-gradient mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-center text-4xl font-extrabold text-transparent">
            Task Dashboard
          </h1>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <TaskColumn
              title="TODO"
              tasks={tasksByStatus.todo}
              status="TODO"
              onMoveTask={moveTask}
            />
            <TaskColumn
              title="IN PROGRESS"
              tasks={tasksByStatus.inProgress}
              status="IN_PROGRESS"
              onMoveTask={moveTask}
            />
            <TaskColumn
              title="COMPLETED"
              tasks={tasksByStatus.completed}
              status="COMPLETED"
              onMoveTask={moveTask}
            />
          </div>

          <TaskColumn
            title="BACKLOG"
            tasks={tasksByStatus.backlog}
            status="BACKLOG"
            onMoveTask={moveTask}
          />
        </div>
      </div>
    </Card>
  );
};

const Page = () => (
  <DndProvider backend={HTML5Backend}>
    <DashboardContent />
  </DndProvider>
);

export default Page;
