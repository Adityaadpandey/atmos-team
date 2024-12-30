"use server";

import { db } from "@/lib/db";

// Server action to delete a task by ID
export async function deleteTask(id: string) {
  try {
    if (!id) {
      throw new Error("Task ID is required.");
    }

    // Delete the task
    const deletedTask = await db.task.delete({
      where: { id },
    });

    return deletedTask;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("An error occurred while deleting the task.");
  }
}
