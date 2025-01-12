"use server";

import { db } from "@/lib/db";

export async function getCommentsOnTask(taskId: string) {
  try {
    if (!taskId) {
      throw new Error("taskId is required.");
    }

    const comments = await db.comment.findMany({
      where: {
        taskId,
        // Only get top-level comments (no parentId)
        parentId: null,
      },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
            attachments: true,
          },
        },
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  } catch (error) {
    console.error("Error getting task comments:", error);
    throw new Error("An error occurred while getting the comments.");
  }
}

export async function getCommentsOnSubTask(subTaskId: string) {
  try {
    if (!subTaskId) {
      throw new Error("subTaskId is required.");
    }

    const comments = await db.comment.findMany({
      where: {
        subTaskId,
        parentId: null,
      },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
            attachments: true,
          },
        },
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  } catch (error) {
    console.error("Error getting subtask comments:", error);
    throw new Error("An error occurred while getting the comments.");
  }
}
