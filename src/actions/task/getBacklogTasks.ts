"use server";

import { db } from "@/lib/db";

// Server action to get tasks with status 'BACKLOG'
export async function getBacklogTasks() {
  try {
    // Fetch all tasks with status 'BACKLOG'
    const backlogTasks = await db.task.findMany({
      where: { status: "BACKLOG" },
    });

    return backlogTasks;
  } catch (error) {
    console.error("Error retrieving backlog tasks:", error);
    throw new Error("An error occurred while retrieving backlog tasks.");
  }
}
