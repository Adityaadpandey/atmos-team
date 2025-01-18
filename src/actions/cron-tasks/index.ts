"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Function to get the latest tasks assigned or created by the current user
export async function getLatestTask() {
  try {
    // Get the user ID from the authentication context
    const { userId } = await auth();

    // Ensure a valid user ID is present
    if (!userId) {
      throw new Error("Valid user ID is required.");
    }

    // Fetch tasks that are either assigned to the user or created by the user
    const tasks = db.task.findMany({
      where: {
        OR: [
          { assignees: { some: { id: userId } } }, // Tasks assigned to the user
          { creatorId: userId }, // Tasks created by the user
        ],
      },
      select: {
        id: true, // Include task ID in the result
        title: true, // Include task title in the result
      },
      orderBy: {
        createdAt: "desc", // Sort tasks by creation date in descending order
      },
    });

    return tasks; // Return the list of tasks
  } catch (err) {
    console.log(err); // Log any errors that occur
  }
}
