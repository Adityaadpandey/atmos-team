'use client';

import { getAllTaskAndSubTask } from "@/actions/task";
import { Task } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card"; // Custom theme Card component
import { Button } from "@/components/ui/button"; // Custom theme Button component
import { Badge } from "@/components/ui/badge"; // Assuming Badge component exists for status display

const Page = () => {
  const { isLoaded, userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuth = async () => {
      if (!userId) {
        setError("User ID is not available.");
        setLoading(false);
        return;
      }

      try {
        const data = await getAllTaskAndSubTask(userId);
        console.log(data);
        setTasks(data.tasks as Task[]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching tasks and subtasks.");
        setLoading(false);
      }
    };

    if (isLoaded && userId) {
      fetchAuth();
    }
  }, [isLoaded, userId]);

  if (loading) {
    return <div className="text-center text-lg text-red-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  // Separate tasks into categories by status
  const todoTasks = tasks.filter(task => task.status === 'TODO');
  const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED');
  const backlogTasks = tasks.filter(task => task.status === 'BACKLOG');

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-center mb-8 text-primary">Dashboard</h1>

        {/* Task Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TODO */}
          <Card className="p-6">
            <div>
              <h2 className="text-xl font-semibold text-center text-primary mb-4">TODO</h2>
              <div className="space-y-4">
                {todoTasks.map(task => (
                  <Card key={task.id} className="p-4 bg-card rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
                    <h3 className="text-lg font-medium text-primary">{task.title}</h3>
                    <p className="text-muted mt-2">{task.description}</p>
                    <Badge variant="todo" className="mt-2">{task.status}</Badge> {/* Assuming Badge component for status */}
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          {/* IN_PROGRESS */}
          <div>
            <h2 className="text-xl font-semibold text-center text-primary mb-4">IN PROGRESS</h2>
            <div className="space-y-4">
              {inProgressTasks.map(task => (
                <Card key={task.id} className="p-4 bg-card rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
                  <h3 className="text-lg font-medium text-primary">{task.title}</h3>
                  <p className="text-muted mt-2">{task.description}</p>
                  <Badge variant="in-progress" className="mt-2">{task.status}</Badge>
                </Card>
              ))}
            </div>
          </div>

          {/* COMPLETED */}
          <div>
            <h2 className="text-xl font-semibold text-center text-primary mb-4">COMPLETED</h2>
            <div className="space-y-4">
              {completedTasks.map(task => (
                <Card key={task.id} className="p-4 bg-card rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
                  <h3 className="text-lg font-medium text-primary">{task.title}</h3>
                  <p className="text-muted mt-2">{task.description}</p>
                  <Badge variant="completed" className="mt-2">{task.status}</Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* BACKLOG */}
        <div>
          <h2 className="text-xl font-semibold text-center text-primary mb-4">BACKLOG</h2>
          <div className="space-y-4">
            {backlogTasks.map(task => (
              <Card key={task.id} className="p-4 bg-card rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
                <h3 className="text-lg font-medium text-primary">{task.title}</h3>
                <p className="text-muted mt-2">{task.description}</p>
                <Badge variant="backlog" className="mt-2">{task.status}</Badge>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
