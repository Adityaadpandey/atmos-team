import { CheckCircle2, CircleDashed, RotateCcw, Timer } from "lucide-react";

export const StatusIcon = ({ status }: { status: TaskStatus }) => {
  const icons = {
    TODO: <CircleDashed className="h-5 w-5" />,
    IN_PROGRESS: <Timer className="h-5 w-5" />,
    COMPLETED: <CheckCircle2 className="h-5 w-5" />,
    BACKLOG: <RotateCcw className="h-5 w-5" />,
  };
  return icons[status];
};
