import { db } from "@/lib/db";

// Server action to update task status to "BACKLOG"
export async function moveTaskToBacklog(id: string) {
  try {
    // Check if the task ID is provided
    if (!id) {
      throw new Error("Task ID is required.");
    }

    // Update the task status to "BACKLOG" in the database
    const updatedTask = await db.task.update({
      where: { id }, // Find the task by its ID
      data: {
        status: "BACKLOG", // Change the status of the task to "BACKLOG"
      },
    });

    // Return the updated task with the new status
    return updatedTask;
  } catch (error) {
    // Log the error if the update fails
    console.error("Error moving task to backlog:", error);
    // Throw a new error with a message
    throw new Error("An error occurred while updating the task.");
  }
}
