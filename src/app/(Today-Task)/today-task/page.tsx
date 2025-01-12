"use client";

import { useState, useEffect } from "react";
import { getPersonalTask } from "@/actions/task";
import { Task } from "@prisma/client";
import TimelineView from "./View";

const Page = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Fetch your tasks here
    const fetchTasks = async () => {
      const data = await getPersonalTask();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  return <TimelineView tasks={tasks} />;
};

export default Page;
