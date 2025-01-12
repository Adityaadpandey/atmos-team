"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getTaskById(id: string) {
  const { userId } = await auth();
  try {
    if (!id || typeof id !== "string" || id.trim() === "") {
      throw new Error("Task ID is required and should be a valid string.");
    }

    // Fetch task details by ID using Prisma
    const task = await db.task.findUnique({
      where: { id },
      include: {
        assignees: {
          select: { id: true, name: true, email: true },
        },
        team: true,
        subTasks: {
          select: {
            id: true,
            title: true,
            status: true,
            assigneeId: true,
            createdAt: true,
          },
        },
        comments: {
          include: {
            author: true,
            attachments: true,
            replies: {
              include: { author: true },
            },
          },
        },
        relatedTasks: {
          // Fetch related tasks
          select: { id: true, title: true, status: true },
        },
        prerequisiteOf: {
          // Fetch prerequisite tasks
          select: { id: true, title: true, status: true },
        },
        attachments: {
          // Fetch attachments directly related to the task
          select: { id: true, name: true, url: true, type: true, size: true },
        },
      },
    });

    if (!task) {
      throw new Error(`Task with ID ${id} not found.`);
    }
    if (
      !task.assignees.some((assignee) => assignee.id === userId) &&
      task.creatorId !== userId
    ) {
      throw new Error("You are not authorized to view this task.");
    }
    console.log("Task retrieved successfully:", task);
    return task;
  } catch (error: any) {
    console.error("Error retrieving task:", error.message);
    throw new Error(
      error.message || "An error occurred while retrieving the task.",
    );
  }
}
