"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Function to get tasks assigned to the current user
export const getAssignedTask = async () => {
  try {
    // Authenticate the user and get their userId
    const { userId } = await auth();

    // Check if the user is logged in
    if (!userId) {
      throw new Error("You must be logged in to create tasks");
    }

    // Fetch tasks where the user is an assignee
    const tasks = await db.task.findMany({
      where: {
        assignees: {
          some: {
            id: userId, // Check if the user is assigned to the task
          },
        },
      },
      include: {
        assignees: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true, // Fetch assignee details
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true, // Fetch creator details
          },
        },
      },
    });

    // Return the fetched tasks
    return tasks;
  } catch (err) {
    // Log the error if fetching tasks fails
    console.log("Can't get the assigned tasks of the user", err);
  }
};
