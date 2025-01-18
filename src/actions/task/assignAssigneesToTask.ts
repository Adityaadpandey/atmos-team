"use server";

import { db } from "@/lib/db";

// Function to assign assignees to a task
export async function assignAssigneesToTask({
  taskId, // ID of the task to assign assignees to
  assigneeIds, // List of assignee IDs to be assigned to the task
}: {
  taskId: string;
  assigneeIds: string[];
}) {
  try {
    // Check if taskId and assigneeIds are provided
    if (!taskId || !assigneeIds?.length) {
      throw new Error("Task ID and assignee IDs are required.");
    }

    // Prepare the data to update the task with the assignees
    const taskData = {
      assignees: {
        connect: assigneeIds.map((userId: string) => ({ id: userId })),
      },
    };

    // Update the task with the new assignees
    const updatedTask = await db.task.update({
      where: { id: taskId }, // Find task by ID
      data: taskData, // Assign assignees to the task
    });

    return updatedTask; // Return the updated task
  } catch (error) {
    console.error("Error assigning task:", error); // Log any errors
    throw new Error("An error occurred while assigning the task."); // Show a friendly error message
  }
}
