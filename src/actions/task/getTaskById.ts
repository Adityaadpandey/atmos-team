"use server";

import { db } from "@/lib/db";

// Server action to fetch task by ID
export async function getTaskById(id: string) {
  try {
    if (!id) {
      throw new Error("Task ID is required.");
    }

    // Fetch task details by ID using Prisma
    const task = await db.task.findUnique({
      where: { id },
      include: {
        assignees: {
          select: { id: true, name: true, email: true },
        },
        team: true,
        subTasks: true,
        comments: { include: { author: true } },
        timeline: { include: { previousTask: true, nextTask: true } },
      },
    });

    if (!task) {
      throw new Error(`Task with ID ${id} not found.`);
    }

    return task;
  } catch (error) {
    console.error("Error retrieving task:", error.message);
    throw new Error("An error occurred while retrieving the task.");
  }
}
