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
          select: {
            id: true,
            title: true,
            description: true,
            deadline: true, // Include the deadline of the task
            createdAt: true, // Include the createdAt field
            updatedAt: true, // Include the updatedAt field
            status: true,
            assignees: {
              select: { id: true, name: true, email: true },
            },
            team: true,
            comments: { include: { author: true } },
            timeline: { include: { previousTask: true, nextTask: true } },
            subTasks: true, // Assuming you want subtasks included as well
            relatedTasks: true, // Related tasks (if you want them as well)
          },
        },
      },
    });

    if (!userTasks) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    return userTasks;
  } catch (error) {
    console.error("Error retrieving tasks and subtasks:", error); // Log the full error
    throw new Error(
      "An error occurred while retrieving the tasks and subtasks.",
    );
  }
}
