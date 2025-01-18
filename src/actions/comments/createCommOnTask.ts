"use server";

import { db } from "@/lib/db";

type CreateTaskCommentInput = {
  taskId: string; // ID of the task where the comment will be added
  text: string; // The content of the comment
  authorId: string; // ID of the author adding the comment
};

export async function createCommentOnTask({
  taskId,
  text,
  authorId,
}: CreateTaskCommentInput) {
  try {
    // Validate that the comment text is not empty
    if (!text?.trim()) {
      throw new Error("Comment text cannot be empty");
    }

    // Ensure a valid Task ID is provided
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    // Ensure a valid Author ID is provided
    if (!authorId) {
      throw new Error("Author ID is required");
    }

    // Check if the Task exists in the database
    const task = await db.task.findUnique({
      where: { id: taskId },
    });

    // Throw an error if the Task does not exist
    if (!task) {
      throw new Error("Task not found");
    }

    // Create a new comment in the database and connect it to the Task and Author
    const newComment = await db.comment.create({
      data: {
        text: text.trim(), // Save the trimmed comment text
        task: { connect: { id: taskId } }, // Connect the comment to the Task
        author: { connect: { id: authorId } }, // Connect the comment to the Author
      },
      include: {
        author: true, // Include the Author details in the response
        task: true, // Include the Task details in the response
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
