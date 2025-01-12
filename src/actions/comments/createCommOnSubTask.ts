"use server";

import { db } from "@/lib/db";
import { Comment } from "@prisma/client";

type CreateCommentInput = {
  subTaskId: string;
  text: string;
  authorId: string;
};

export async function createCommentOnSubTask({
  subTaskId,
  text,
  authorId,
}: CreateCommentInput): Promise<Comment> {
  try {
    // Input validation
    if (!text?.trim()) {
      throw new Error("Comment text cannot be empty");
    }

    if (!subTaskId) {
      throw new Error("SubTask ID is required");
    }

    if (!authorId) {
      throw new Error("Author ID is required");
    }

    // Verify subtask exists
    const subTask = await db.subTask.findUnique({
      where: { id: subTaskId },
    });

    if (!subTask) {
      throw new Error("SubTask not found");
    }

    // Create comment
    const newComment = await db.comment.create({
      data: {
        text: text.trim(),
        subTask: { connect: { id: subTaskId } },
        author: { connect: { id: authorId } },
        // Also connect to the parent task for proper relationships
        task: { connect: { id: subTask.taskId } },
      },
      include: {
        author: true,
        subTask: true,
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
