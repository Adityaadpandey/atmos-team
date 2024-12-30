"use server";

import { db } from "@/lib/db";

// Server action to create a task
export async function createTask({
  title,
  description,
  deadline,
  teamId,
  assigneeIds,
}: {
  title: string;
  description?: string;
  deadline: string;
  teamId?: string;
  assigneeIds?: string[];
}) {
  try {
    // Validate required fields
    if (!title || !deadline) {
      throw new Error("Title and deadline are required.");
    }

    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      throw new Error("Invalid deadline format. Please provide a valid date.");
    }

    // Prepare task data
    const taskData = {
      title,
      description: description || null,
      deadline: parsedDeadline,
      team: teamId ? { connect: { id: teamId } } : undefined,
      assignees: {
        connect: assigneeIds?.map((userId: string) => ({ id: userId })) || [],
      },
    };

    // Create the task in the database
    const newTask = await db.task.create({ data: taskData });

    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("An error occurred while creating the task.");
  }
}
