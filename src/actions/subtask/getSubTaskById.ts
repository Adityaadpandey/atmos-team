"use server";

import { db } from "@/lib/db";

// Server action to fetch subtask by ID
export async function getSubTaskById(id: string) {
  try {
    if (!id) {
      throw new Error("Subtask ID is required.");
    }

    // Fetch subtask details by ID using Prisma
    const subTask = await db.subTask.findUnique({
      where: { id },
    });

    if (!subTask) {
      throw new Error(`Subtask with ID ${id} not found.`);
    }

    return subTask;
  } catch (error) {
    console.error("Error retrieving subtask:", error.message);
    throw new Error("An error occurred while retrieving the subtask.");
  }
}
