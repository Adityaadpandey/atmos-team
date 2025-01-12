"use client";

import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, X, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAlert } from "@/hooks/Alert-Provider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { createSubTask } from "@/actions/subtask";

const Page = ({ params }: { params: Promise<{ TaskId: string }> }) => {
  const { TaskId } = use(params);
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [subtasks, setSubtasks] = useState<string[]>([]);

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

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (const subtaskTitle of subtasks) {
        await createSubTask({
          taskId: TaskId,
          title: subtaskTitle,
          status: "TODO",
        });
      }
      showAlert("Subtasks created successfully", "success");
    } catch {
      showAlert("Error creating subtasks", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Subtasks</CardTitle>
          <CardDescription>
            Add subtasks to break down your main task into smaller, manageable
            pieces
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Plus className="h-4 w-4 text-primary" />
                Add New Subtask
              </label>

              <div className="relative">
                <Input
                  placeholder="Type a subtask and press Enter"
                  onKeyDown={handleSubtaskInput}
                  className="border-primary/20 pr-10 transition-colors focus:border-primary"
                />
                <Plus className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-50" />
              </div>
            </div>

            <div className="space-y-2">
              {subtasks.length > 0 && (
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Added Subtasks ({subtasks.length})
                  </span>
                </div>
              )}

              <div className="space-y-2">
                {subtasks.map((subtask, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between rounded-lg bg-primary/5 px-4 py-3 transition-all hover:bg-primary/10"
                  >
                    <span className="text-sm">{subtask}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                      className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/90 transition-all duration-300 hover:from-primary/90 hover:to-primary"
              disabled={loading || subtasks.length === 0}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 animate-spin" />
                  Creating Subtasks...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create {subtasks.length} Subtask
                  {subtasks.length !== 1 ? "s" : ""}
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Page;
