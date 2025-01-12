"use server";

import { db } from "@/lib/db";

type CreateTaskCommentInput = {
  taskId: string;
  text: string;
  authorId: string;
};

export async function createCommentOnTask({
  taskId,
  text,
  authorId,
}: CreateTaskCommentInput) {
  try {
    // Input validation
    if (!text?.trim()) {
      throw new Error("Comment text cannot be empty");
    }

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    if (!authorId) {
      throw new Error("Author ID is required");
    }

    // Verify task exists
    const task = await db.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    // Create comment
    const newComment = await db.comment.create({
      data: {
        text: text.trim(),
        task: { connect: { id: taskId } },
        author: { connect: { id: authorId } },
      },
      include: {
        author: true,
        task: true,
      },
    });

    return newComment;
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to create comment");
  }
}
