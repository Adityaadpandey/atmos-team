"use client";

import { getTaskById } from "@/actions/task";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskMain } from "@/types";
import { use, useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ TaskId: string }>;
}) {
  const { TaskId } = use(params);
  const [task, setTask] = useState<TaskMain | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const response = async () => {
      const data = await getTaskById(TaskId);
      setTask(data);
    };
    response();
  }, [TaskId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{task?.title}</CardTitle>
        <CardDescription>{task?.description}</CardDescription>
      </CardHeader>
      <Card>
        <Badge>{task?.status}</Badge>
      </Card>
    </Card>
  );
}
