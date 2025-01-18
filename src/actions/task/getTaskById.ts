"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Function to get task details by task ID
export async function getTaskById(id: string) {
  // Authenticate the user and get their userId
  const { userId } = await auth();
  try {
    // Validate the provided task ID
    if (!id || typeof id !== "string" || id.trim() === "") {
      throw new Error("Task ID is required and should be a valid string.");
    }

    // Fetch task details by ID using Prisma
    const task = await db.task.findUnique({
      where: { id }, // Find the task by its ID
      include: {
        assignees: {
          select: { id: true, name: true, email: true }, // Fetch assignee details
        },
        team: true, // Fetch the team related to the task
        subTasks: {
          select: {
            id: true,
            title: true,
            status: true,
            assigneeId: true,
            createdAt: true, // Fetch subtask details
          },
        },
        comments: {
          include: {
            author: true, // Fetch comment authors
            attachments: true, // Fetch attachments related to comments
            replies: {
              include: { author: true }, // Fetch replies to comments
            },
          },
        },
        relatedTasks: {
          select: { id: true, title: true, status: true }, // Fetch related tasks
        },
        prerequisiteOf: {
          select: { id: true, title: true, status: true }, // Fetch prerequisite tasks
        },
        attachments: {
          select: { id: true, name: true, url: true, type: true, size: true }, // Fetch task attachments
        },
      },
    });

    // Check if the task was found
    if (!task) {
      throw new Error(`Task with ID ${id} not found.`);
    }

    // Check if the user is authorized to view the task
    if (
      !task.assignees.some((assignee) => assignee.id === userId) &&
      task.creatorId !== userId
    ) {
      throw new Error("You are not authorized to view this task.");
    }

    // Log the successful retrieval of the task
    console.log("Task retrieved successfully:", task);

    // Return the task details
    return task;
  } catch (error: any) {
    // Log any error that occurs
    console.error("Error retrieving task:", error.message);
    throw new Error(
      error.message || "An error occurred while retrieving the task.",
    );
  }
}
