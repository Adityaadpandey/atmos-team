"use client";

import { createSubTask } from "@/actions/subtask";
import { createTask } from "@/actions/task";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAlert } from "@/hooks/Alert-Provider";
import { TaskStatus } from "@prisma/client";
import {
  AlertCircle,
  Bookmark,
  Calendar,
  Plus,
  Target,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";

const CreateTaskPage = () => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<string[]>([]);

  const handleEmailInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const email = event.currentTarget.value.trim();
      if (email && validateEmail(email)) {
        if (!emails.includes(email)) {
          setEmails([...emails, email]);
        }
        event.currentTarget.value = "";
      }
    }
  };

  const handleSubtaskInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const subtask = event.currentTarget.value.trim();
      if (subtask) {
        setSubtasks([...subtasks, subtask]);
        event.currentTarget.value = "";
      }
    }
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Extract and validate the data
    const taskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      deadline: formData.get("deadline") as string,
      assigneeEmails: emails,
      priority: "MEDIUM" as const, // You can make this dynamic if needed
    };

    // Validate required fields
    if (!taskData.title?.trim()) {
      showAlert("Error!", "Please add a task title!", "error");
      setLoading(false);
      return;
    }

    try {
      const newTask = await createTask(taskData);

      if (newTask) {
        // Create subtasks only if main task was created successfully
        await Promise.all(
          subtasks.map((subtaskTitle) =>
            createSubTask({
              taskId: newTask.id,
              title: subtaskTitle,
              status: TaskStatus.TODO,
            }),
          ),
        );

        showAlert("Success", "Task created successfully.", "success");

        // Reset form
        form.reset();
        setEmails([]);
        setSubtasks([]);
      }
    } catch (error) {
      console.error("Task creation error:", error);
      showAlert(
        "Error!",
        error instanceof Error ? error.message : "Failed to create task",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="mx-auto max-w-4xl space-y-8 p-6 sm:p-8">
        <Card className="overflow-hidden border-none bg-gradient-to-r from-primary/5 via-primary/10 to-background shadow-xl">
          <div className="relative p-6 sm:p-8">
            <h1 className="mb-8 bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              Create New Task
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Target className="h-4 w-4 text-primary" />
                    Task Title
                  </label>
                  <Input
                    required
                    name="title"
                    placeholder="What needs to be done?"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Bookmark className="h-4 w-4 text-primary" />
                    Description
                  </label>
                  <Textarea
                    name="description"
                    placeholder="Add more details about this task..."
                    className="min-h-[100px] border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    Deadline
                  </label>
                  <Input
                    type="date"
                    required
                    name="deadline"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4 text-primary" />
                    Team Members
                  </label>
                  <Input
                    placeholder="Enter email and press Enter"
                    onKeyDown={handleEmailInput}
                    className="border-primary/20 focus:border-primary"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {emails.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5"
                      >
                        <span className="text-sm">{email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Plus className="h-4 w-4 text-primary" />
                    Subtasks
                  </label>
                  <Input
                    placeholder="Enter subtask and press Enter"
                    onKeyDown={handleSubtaskInput}
                    className="border-primary/20 focus:border-primary"
                  />
                  <div className="mt-2 space-y-2">
                    {subtasks.map((subtask, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-primary/5 px-4 py-2"
                      >
                        <span className="text-sm">{subtask}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Task"
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateTaskPage;
