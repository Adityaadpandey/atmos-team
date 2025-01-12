import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  format,
  addDays,
  differenceInDays,
  startOfDay,
  isToday,
  isPast,
  parseISO,
} from "date-fns";
import {
  Calendar,
  AlertCircle,
  Filter,
  Clock,
  Search,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { BacklogCard } from "./_components/BacklogCard";
import { TaskCard } from "./_components/taskCard";

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
  deadline: string | Date;
  createdAt: string | Date;
  assignees?: Assignee[];
  progress?: number;
}

interface TimelineProps {
  tasks: Task[];
}

const CELL_WIDTH = 180;
const COMPACT_HEIGHT = 88;
// const EXPANDED_HEIGHT = 200;
const VERTICAL_GAP = 16;
const DEFAULT_DAYS_TO_SHOW = 30;

// Helper function to safely parse dates
const parseDate = (date: string | Date): Date => {
  if (date instanceof Date) return date;
  try {
    return parseISO(date);
  } catch {
    return new Date(date);
  }
};

const TimelineView: React.FC<TimelineProps> = ({ tasks }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [daysToShow, setDaysToShow] = useState(DEFAULT_DAYS_TO_SHOW);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());

  const backlogTasks = tasks.filter(
    (task) => task.status.toUpperCase() === "BACKLOG",
  );
  const activeTasks = tasks.filter(
    (task) => task.status.toUpperCase() !== "BACKLOG",
  );

  const filteredTasks = activeTasks
    .filter((task) =>
      selectedTab === "all"
        ? true
        : task.status.toUpperCase() === selectedTab.toUpperCase(),
    )
    .filter((task) =>
      selectedPriority === "all"
        ? true
        : task.priority.toUpperCase() === selectedPriority.toUpperCase(),
    )
    .filter((task) =>
      searchQuery
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    );

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  // Calculate the earliest date from tasks
  const earliestDate = startOfDay(
    tasks.reduce((earliest, task) => {
      const taskDate = parseDate(task.createdAt);
      return taskDate < earliest ? taskDate : earliest;
    }, today),
  );

  // Calculate how many days we need to show after the latest deadline
  const latestDate = startOfDay(
    tasks.reduce((latest, task) => {
      const taskDate = parseDate(task.deadline);
      return taskDate > latest ? taskDate : latest;
    }, today),
  );

  // Calculate total days needed to show all tasks plus padding
  const totalDaysNeeded = differenceInDays(latestDate, earliestDate) + 14; // Add padding

  // Use the larger of totalDaysNeeded or daysToShow
  const effectiveDaysToShow = Math.max(totalDaysNeeded, daysToShow);

  // Generate dates array starting from earliestDate
  const dates = Array.from({ length: effectiveDaysToShow }, (_, i) =>
    addDays(earliestDate, i),
  );

  const getTaskPositions = (tasks: Task[]) => {
    const taskPositions = new Map<
      string,
      { left: number; width: number; top: number }
    >();
    const rows: { start: number; end: number }[][] = [[]];

    const sortedTasks = [...tasks].sort(
      (a, b) =>
        parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime(),
    );

    sortedTasks.forEach((task) => {
      const startDate = startOfDay(parseDate(task.createdAt));
      const endDate = startOfDay(parseDate(task.deadline));

      // Calculate position relative to earliest date
      const left = differenceInDays(startDate, earliestDate);
      const width = Math.max(1, differenceInDays(endDate, startDate) + 1);

      let rowIndex = 0;
      let fits = false;

      while (!fits) {
        if (!rows[rowIndex]) {
          rows[rowIndex] = [];
        }

        fits = !rows[rowIndex].some(
          (existing) =>
            (left < existing.end && left + width > existing.start) ||
            (existing.start < left + width && existing.end > left),
        );

        if (fits) {
          rows[rowIndex].push({ start: left, end: left + width });
        } else {
          rowIndex++;
        }
      }

      taskPositions.set(task.id, {
        left: left * CELL_WIDTH * zoomLevel,
        width: width * CELL_WIDTH * zoomLevel,
        top: rowIndex * (COMPACT_HEIGHT + VERTICAL_GAP),
      });
    });

    return { taskPositions, rowCount: rows.length };
  };

  const { taskPositions, rowCount } = getTaskPositions(filteredTasks);

  // Scroll to the earliest task position on initial render
  useEffect(() => {
    if (containerRef.current && headerRef.current) {
      const scrollToPosition = 0;
      containerRef.current.scrollLeft = scrollToPosition;
      headerRef.current.scrollLeft = scrollToPosition;
    }
  }, [zoomLevel]);

  // Enhanced scroll sync between header and content
  const handleScroll = useCallback(() => {
    if (containerRef.current && headerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      headerRef.current.scrollLeft = scrollLeft;
      setScrollPosition(scrollLeft);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <Card className="flex h-screen w-screen max-w-[90vw] flex-col overflow-hidden bg-gradient-to-br from-background via-background/95 to-muted/20 p-5">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Calendar className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Timeline</h2>
          <Badge variant="secondary" className="text-sm">
            {filteredTasks.length} Tasks
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent pl-10 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="HIGH">High Priority</SelectItem>
              <SelectItem value="MEDIUM">Medium Priority</SelectItem>
              <SelectItem value="LOW">Low Priority</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Select
            value={daysToShow.toString()}
            onValueChange={(value) => setDaysToShow(parseInt(value))}
          >
            <SelectTrigger className="w-[130px]">
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="60">60 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-[400px] grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="todo">Todo</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {backlogTasks.length > 0 && (
        <Card className="my-5 bg-muted/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-violet-500" />
              <h3 className="font-semibold">Backlog</h3>
              <Badge variant="secondary">{backlogTasks.length}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {backlogTasks.map((task) => (
              <BacklogCard key={task.id} task={task} />
            ))}
          </div>
        </Card>
      )}

      <div
        ref={headerRef}
        className="overflow-x-hidden"
        style={{ scrollBehavior: "smooth" }}
      >
        <div
          className="grid auto-cols-fr grid-flow-col gap-0 border-b border-border/50"
          style={{
            width: `${effectiveDaysToShow * CELL_WIDTH * zoomLevel}px`,
          }}
        >
          {dates.map((date, i) => (
            <div
              key={i}
              className={`p-3 text-center transition-colors ${
                isToday(date)
                  ? "bg-primary/10"
                  : isPast(date)
                    ? "bg-muted/5"
                    : ""
              }`}
              style={{ width: `${CELL_WIDTH * zoomLevel}px` }}
            >
              <div className="text-lg font-bold text-primary">
                {format(date, "d")}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(date, "EEE")}
              </div>
              {isToday(date) && (
                <div className="absolute bottom-0 left-0 h-full w-px bg-primary/50" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 flex-1 overflow-x-auto overflow-y-auto p-6"
        style={{ scrollBehavior: "smooth" }}
      >
        <div
          ref={contentRef}
          className="relative"
          style={{
            width: `${effectiveDaysToShow * CELL_WIDTH * zoomLevel}px`,
            height: `${rowCount * (COMPACT_HEIGHT + VERTICAL_GAP)}px`,
            minHeight: "100%",
          }}
        >
          <div className="absolute inset-0 grid auto-cols-fr grid-flow-col divide-x divide-border/20">
            {dates.map((date, i) => (
              <div
                key={i}
                style={{ width: `${CELL_WIDTH * zoomLevel}px` }}
                className={`${
                  isToday(date)
                    ? "bg-primary/5"
                    : isPast(date)
                      ? "bg-muted/5"
                      : ""
                }`}
              />
            ))}
          </div>

          {filteredTasks.map((task) => {
            const position = taskPositions.get(task.id);
            if (!position) return null;

            return (
              <div
                key={task.id}
                className="absolute"
                style={{
                  left: position.left,
                  top: position.top,
                  width: position.width,
                }}
              >
                <TaskCard task={task} />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default TimelineView;
