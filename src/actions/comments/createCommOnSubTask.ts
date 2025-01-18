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
    // Validate that the comment text is not empty
    if (!text?.trim()) {
      throw new Error("Comment text cannot be empty");
    }

    // Ensure a valid SubTask ID is provided
    if (!subTaskId) {
      throw new Error("SubTask ID is required");
    }

    // Ensure a valid Author ID is provided
    if (!authorId) {
      throw new Error("Author ID is required");
    }

    // Check if the SubTask exists in the database
    const subTask = await db.subTask.findUnique({
      where: { id: subTaskId },
    });

    // Throw an error if the SubTask does not exist
    if (!subTask) {
      throw new Error("SubTask not found");
    }

    // Create a new comment in the database and connect it to the SubTask and Author
    const newComment = await db.comment.create({
      data: {
        text: text.trim(), // Save the trimmed comment text
        subTask: { connect: { id: subTaskId } }, // Connect the comment to the SubTask
        author: { connect: { id: authorId } }, // Connect the comment to the Author
        task: { connect: { id: subTask.taskId } }, // Connect the comment to the parent Task
      },
      include: {
        author: true, // Include the Author details in the response
        subTask: true, // Include the SubTask details in the response
      },
    });

    return newComment; // Return the newly created comment
  } catch (error) {
    console.error("Failed to create comment:", error); // Log the error for debugging
    throw error instanceof Error
      ? error // Re-throw the error if it's an instance of Error
      : new Error("Failed to create comment"); // Otherwise, throw a generic error
  }
}
