// components/TaskColumn.tsx
import { Badge } from "@/components/ui/badge";
import { SubTask } from "@/types/enums";
import { AnimatePresence } from "framer-motion";
import { useDrop } from "react-dnd";
import { SubTaskCard } from "./SubTaskCard";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: SubTask[];
  status: string;
  onMoveTask: (task: SubTask, newStatus: string) => void;
  itemType: string;
}

export const SubTaskColumn = ({
  title,
  tasks,
  status,
  onMoveTask,
  itemType,
}: TaskColumnProps) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: itemType,
    drop: (item: SubTask) => onMoveTask(item, status),
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
      className={`rounded-xl border-2 ${columnStyles[status]} ${
        isOver ? "ring-2 ring-primary" : ""
      } bg-background/50 backdrop-blur-sm transition-all duration-300`}
    >
      <div className="p-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Badge variant="secondary">{tasks.length}</Badge>
        </div>
        <div className="space-y-4">
          <AnimatePresence>
            {tasks.map((subtask) => (
              <SubTaskCard
                key={subtask.id}
                subtask={subtask}
                itemType={itemType}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export const TaskColumn = ({
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
    accept: "TASK",
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
      className={`rounded-xl border-2 ${columnStyles[status]} ${
        isOver ? "ring-2 ring-primary" : ""
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
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
