// components/SubTaskCard.tsx
import { Card } from "@/components/ui/card";
import { SubTask, TaskStatus } from "@/types";
import { motion } from "framer-motion";
import { useDrag } from "react-dnd";
import { StatusIcon } from "./StatusIcon";

interface SubTaskCardProps {
  subtask: SubTask;
  itemType: string;
}

export const SubTaskCard = ({ subtask, itemType }: SubTaskCardProps) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: itemType,
    item: subtask,
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
        className={`group p-4 ${cardStyles[subtask.status]} cursor-move rounded-xl border-none backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 ${isDragging ? "rotate-3 opacity-50" : "opacity-100"}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon status={subtask.status} />
            <span className="text-sm font-medium text-muted-foreground">
              {subtask.status.replace("_", " ")}
            </span>
          </div>
        </div>

        <h3 className="mb-2 truncate text-lg font-semibold tracking-tight">
          {subtask.title}
        </h3>

        <div className="text-sm text-muted-foreground">
          Created: {new Date(subtask.createdAt).toLocaleDateString()}
        </div>
      </Card>
    </motion.div>
  );
};
