"use server";

import { db } from "@/lib/db";

// Server action to assign assignees to a task
export async function assignAssigneesToTask({
  taskId,
  assigneeIds,
}: {
  taskId: string;
  assigneeIds: string[];
}) {
  try {
    // Validate required fields
    if (!taskId || !assigneeIds?.length) {
      throw new Error("Task ID and assignee IDs are required.");
    }

    // Prepare task data for updating
    const taskData = {
      assignees: {
        connect: assigneeIds.map((userId: string) => ({ id: userId })),
      },
    };

    // Update the task with the assigned assignees
    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: taskData,
    });

    return updatedTask;
  } catch (error) {
    console.error("Error assigning task:", error);
    throw new Error("An error occurred while assigning the task.");
  }
}
