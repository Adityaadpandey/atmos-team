"use server";
import { db } from "@/lib/db";

// Function to delete a subtask by its ID
export async function deleteSubTask(subTaskId: string) {
  try {
    // Attempt to delete the subtask from the database using the provided subTaskId
    const deletedSubTask = await db.subTask.delete({
      where: { id: subTaskId }, // Specify the subtask to delete by its ID
    });

    return deletedSubTask; // Return the details of the deleted subtask
  } catch (error) {
    console.error("Error deleting subtask:", error); // Log any errors that occur during deletion
    throw new Error("Failed to delete subtask"); // Throw a user-friendly error message
  }
}
