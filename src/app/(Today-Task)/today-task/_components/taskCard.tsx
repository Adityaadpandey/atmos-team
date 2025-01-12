import React, { useEffect, useState, useRef, useCallback } from "react";

import { Badge } from "@/components/ui/badge";

import { Progress } from "@/components/ui/progress";

import { motion, AnimatePresence } from "framer-motion";

import { format, isFuture } from "date-fns";
import { ChevronDown, ChevronUp, Clock, Users } from "lucide-react";

interface Assignee {
  id: string;
  name: string;
  avatar?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
  createdAt: string;
  assignees?: Assignee[];
  progress?: number;
}

const CELL_WIDTH = 180;
const COMPACT_HEIGHT = 88;
const EXPANDED_HEIGHT = 200;
const VERTICAL_GAP = 16;

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "BACKLOG":
      return "from-violet-500/90 to-violet-600/90";
    case "TODO":
      return "from-amber-500/90 to-amber-600/90";
    case "IN_PROGRESS":
      return "from-blue-500/90 to-blue-600/90";
    case "COMPLETED":
      return "from-emerald-500/90 to-emerald-600/90";
    default:
      return "from-gray-500/90 to-gray-600/90";
  }
};

const getPriorityBadge = (priority: string) => {
  const colors = {
    HIGH: "bg-red-500/20 text-red-200",
    MEDIUM: "bg-yellow-500/20 text-yellow-200",
    LOW: "bg-green-500/20 text-green-200",
  };
  return colors[priority.toUpperCase()] || "bg-gray-500/20 text-gray-200";
};

export const TaskCard = ({
  task,
  left,
  width,
  top,
}: {
  task: Task;
  left: number;
  width: number;
  top: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPastDue = new Date(task.deadline) < new Date();
  const isUpcoming = isFuture(new Date(task.deadline));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group absolute"
      style={{
        left: `${left * CELL_WIDTH}px`,
        width: `${Math.max(2, width) * CELL_WIDTH - 12}px`,
        top: `${top * (COMPACT_HEIGHT + VERTICAL_GAP)}px`,
        height: isExpanded ? EXPANDED_HEIGHT : COMPACT_HEIGHT,
        transition: "height 0.2s ease-in-out",
      }}
    >
      <motion.div
        className={`h-full rounded-lg bg-gradient-to-r ${getStatusColor(
          task.status,
        )} p-4 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:ring-2 hover:ring-white/30 ${
          isExpanded ? "z-[999]" : "z-1"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={getPriorityBadge(task.priority)}
            >
              {task.priority}
            </Badge>
            <h3 className="line-clamp-1 text-sm font-medium">{task.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${
                isPastDue
                  ? "bg-red-500/20"
                  : isUpcoming
                    ? "bg-emerald-500/20"
                    : "bg-white/10"
              } text-xs text-white`}
            >
              {format(new Date(task.deadline), "MMM d")}
            </Badge>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-full p-1.5 transition-colors hover:bg-white/20"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {task.progress !== undefined && (
          <div className="mt-3">
            <Progress value={task.progress} className="h-1.5" />
            <div className="mt-1 text-right text-xs text-white/70">
              {task.progress}%
            </div>
          </div>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-3"
            >
              <p className="text-sm leading-relaxed opacity-90">
                {task.description}
              </p>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 opacity-70" />
                  <span className="opacity-75">
                    Created: {format(new Date(task.createdAt), "MMM d")}
                  </span>
                </div>
              </div>

              {task.assignees && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 opacity-70" />
                  <div className="flex -space-x-2">
                    {task.assignees.map((assignee) => (
                      <motion.div
                        key={assignee.id}
                        className="h-7 w-7 rounded-full border-2 border-white/50 bg-white/20 transition-transform hover:z-10 hover:scale-110"
                        whileHover={{ y: -2 }}
                        title={assignee.name}
                      >
                        <div className="flex h-full items-center justify-center text-xs font-bold">
                          {assignee.name.charAt(0)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
