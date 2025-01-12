// components/TaskCard.tsx
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { AlertCircle, Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDrag } from "react-dnd";
import { StatusIcon } from "./StatusIcon";

const ITEM_TYPE = "TASK";

type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "BACKLOG";

export const TaskCard = ({ task }: { task: Task }) => {
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
        onClick={() => router.push(`/team/task/${task.id}`)}
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
