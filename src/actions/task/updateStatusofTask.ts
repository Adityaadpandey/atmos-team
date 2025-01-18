"use server";

import { db } from "@/lib/db";
import { TaskStatus } from "@prisma/client";

// Server action to update the status of a task
export const updateStatusofTask = async (
  taskId: string,
  status: TaskStatus,
) => {
  try {
    // Update the status of the task by its ID
    await db.task.update({
      where: {
        id: taskId, // Find the task by its ID
      },
      data: {
        status: status, // Set the new status for the task
      },
    });
  } catch (error) {
    // Log any errors that occur during the task status update
    console.error(error);
  }
};

// Server action to update the status of a subtask
export const updateStatusofSubTask = async (
  taskId: string,
  status: TaskStatus,
) => {
  try {
    // Update the status of the subtask by its ID
    await db.subTask.update({
      where: {
        id: taskId, // Find the subtask by its ID
      },
      data: {
        status: status, // Set the new status for the subtask
      },
    });
  } catch (error) {
    // Log any errors that occur during the subtask status update
    console.error(error);
  }
};
