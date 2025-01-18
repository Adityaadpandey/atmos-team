"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Function to get tasks created by the current user (personal tasks)
export async function getPersonalTask() {
  // Authenticate the user and get their userId
  const { userId } = await auth();

  // Check if the user is logged in
  if (!userId) {
    throw new Error("You must be logged in to create tasks");
  }

  try {
    // Fetch tasks created by the logged-in user
    const tasks = await db.task.findMany({
      where: {
        creatorId: userId, // Filter tasks where the user is the creator
      },
      include: {
        assignees: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true, // Fetch assignee details for each task
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true, // Fetch creator details (the logged-in user)
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
}
