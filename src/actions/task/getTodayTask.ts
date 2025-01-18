"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Function to get tasks that are created by the user and have a deadline greater than or equal to today
export async function getTodayTask() {
  // Authenticate the user and get their userId
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be logged in to create tasks");
  }
  try {
    // Fetch tasks created by the user with a deadline today or in the future
    const tasks = await db.task.findMany({
      where: {
        creatorId: userId, // Filter tasks by the creatorId (the logged-in user)
        deadline: {
          gte: new Date(), // Filter tasks that have a deadline greater than or equal to the current date
        },
      },
    });

    // Return the fetched tasks
    return tasks;
  } catch (err) {
    // Log any error that occurs during the task retrieval process
    console.log("Can't get the assigned tasks of the user", err);
  }
}
