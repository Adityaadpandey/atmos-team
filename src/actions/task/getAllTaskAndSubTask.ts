"use server";

import { db } from "@/lib/db";

// Server action to fetch tasks and subtasks by user ID
export async function getAllTaskAndSubTask(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    // Fetch tasks assigned to the user along with subtasks and other related data
    const userTasks = await db.user.findUnique({
      where: { id: userId },
      include: {
        tasks: {
          include: {
            subTasks: true, // Include subtasks for each task
            assignees: {
              select: { id: true, name: true, email: true },
            },
            team: true,
            comments: { include: { author: true } },
            timeline: { include: { previousTask: true, nextTask: true } },
          },
        },
      },
    });

    if (!userTasks) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    return userTasks;
  } catch (error) {
    console.error("Error retrieving tasks and subtasks:", error.message);
    throw new Error(
      "An error occurred while retrieving the tasks and subtasks.",
    );
  }
}
