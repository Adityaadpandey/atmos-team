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
    // Validate that both taskId and assigneeId are provided
    if (!taskId || !assigneeId) {
      throw new Error("Task ID and assignee ID are required.");
    }

    // Update the task by disconnecting the assignee from the task
    const updatedTask = await db.task.update({
      where: { id: taskId }, // Find the task by its ID
      data: {
        assignees: {
          disconnect: { id: assigneeId }, // Remove the assignee by their ID
        },
      },
    });

    // Return the updated task with the assignee removed
    return updatedTask;
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error removing assignee from task:", error);
    // Throw a new error with a descriptive message
    throw new Error(
      "An error occurred while removing the assignee from the task.",
    );
  }
}
