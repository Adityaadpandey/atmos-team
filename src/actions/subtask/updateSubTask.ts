"use server";

import { db } from "@/lib/db";

// Interface for SubTask with required and optional fields
export interface SubTask {
  id: string; // Unique identifier for the subtask
  title: string; // Title of the subtask
  description?: string; // Optional description of the subtask
  completed: boolean; // Indicates if the subtask is completed
  taskId: string; // ID of the parent task
}

// Function to update a subtask with the given updates
export async function updateSubTask(
  subTaskId: string, // ID of the subtask to update
  updates: Partial<SubTask>, // Updates to be applied to the subtask
) {
  try {
    // Update the subtask in the database using the provided subTaskId and updates
    const updatedSubTask = await db.subTask.update({
      where: { id: subTaskId }, // Specify the subtask to update by its ID
      data: updates, // Apply the updates to the subtask
    });

    return updatedSubTask; // Return the updated subtask
  } catch (error) {
    console.error("Error updating subtask:", error); // Log the error if something goes wrong
    throw new Error("Failed to update subtask"); // Throw a user-friendly error message
  }
}
