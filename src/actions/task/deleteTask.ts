"use server";

import { db } from "@/lib/db";

// Server action to delete a task by ID
export async function deleteTask(id: string) {
  try {
    // Check if the task ID is provided
    if (!id) {
      throw new Error("Task ID is required.");
    }

    // Delete the task from the database
    const deletedTask = await db.task.delete({
      where: { id },
    });

    return deletedTask; // Return the deleted task
  } catch (error) {
    console.error("Error deleting task:", error); // Log the error
    throw new Error("An error occurred while deleting the task."); // Throw a user-friendly error message
  }
}
