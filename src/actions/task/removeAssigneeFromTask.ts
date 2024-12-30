"use server";

import { db } from "@/lib/db";

// Server action to remove an assignee from a task
export async function removeAssigneeFromTask({
  taskId,
  assigneeId,
}: {
  taskId: string;
  assigneeId: string;
}) {
  try {
    // Validate required fields
    if (!taskId || !assigneeId) {
      throw new Error("Task ID and assignee ID are required.");
    }

    // Update the task to disconnect the assignee
    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: {
        assignees: {
          disconnect: { id: assigneeId },
        },
      },
    });

    return updatedTask;
  } catch (error) {
    console.error("Error removing assignee from task:", error);
    throw new Error(
      "An error occurred while removing the assignee from the task.",
    );
  }
}
