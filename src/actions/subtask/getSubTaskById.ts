"use server";

import { db } from "@/lib/db";

// Server action to fetch subtask by its ID
export async function getSubTaskById(id: string) {
  try {
    // Ensure the subtask ID is provided
    if (!id) {
      throw new Error("Subtask ID is required.");
    }

    // Fetch the subtask details from the database using the provided ID
    const subTask = await db.subTask.findUnique({
      where: { id }, // Specify the subtask to fetch by its ID
    });

    // If no subtask is found, throw an error
    if (!subTask) {
      throw new Error(`Subtask with ID ${id} not found.`);
    }

    return subTask; // Return the subtask details if found
  } catch (error) {
    console.error("Error retrieving subtask:", error.message); // Log the error message
    throw new Error("An error occurred while retrieving the subtask."); // Throw a user-friendly error message
  }
}
