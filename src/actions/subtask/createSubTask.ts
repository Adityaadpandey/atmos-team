"use server";

import { db } from "@/lib/db";
import { TaskStatus } from "@prisma/client"; // Import TaskStatus enum directly from Prisma

// Server action to create a subtask
export async function createSubTask({
  taskId,
  title,
  status = TaskStatus.TODO, // Default status is TODO
}: {
  taskId: string;
  title: string;
  status?: TaskStatus;
}) {
  try {
    // Validate required fields
    if (!taskId || !title) {
      throw new Error("Task ID and title are required.");
    }

    // Check if the task with the given taskId exists
    const parentTask = await db.task.findUnique({
      where: { id: taskId },
    });

    if (!parentTask) {
      throw new Error("The provided Task ID does not exist.");
    }

    // Create the subtask data
    const subTaskData = {
      title,
      taskId, // The taskId from the parent task
      status, // The status passed in or default to TODO
    };

    // Create and save the subtask in the database
    const newSubTask = await db.subTask.create({ data: subTaskData });

    return newSubTask;
  } catch (error) {
    console.error("Error creating subtask:", error);
    throw new Error("An error occurred while creating the subtask.");
  }
}
