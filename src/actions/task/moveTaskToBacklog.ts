import { db } from "@/lib/db";

// Server action to update task status to "BACKLOG"
export async function moveTaskToBacklog(id: string) {
  try {
    if (!id) {
      throw new Error("Task ID is required.");
    }

    // Update task status to "BACKLOG"
    const updatedTask = await db.task.update({
      where: { id },
      data: {
        status: "BACKLOG", // Change the status to "BACKLOG"
      },
    });

    return updatedTask;
  } catch (error) {
    console.error("Error moving task to backlog:", error);
    throw new Error("An error occurred while updating the task.");
  }
}
