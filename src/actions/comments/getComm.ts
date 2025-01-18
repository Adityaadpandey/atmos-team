"use server";

import { db } from "@/lib/db";

// Function to get comments for a specific task
export async function getCommentsOnTask(taskId: string) {
  try {
    // Ensure the taskId is provided
    if (!taskId) {
      throw new Error("taskId is required.");
    }

    // Fetch comments for the task, including top-level comments only (no parentId)
    const comments = await db.comment.findMany({
      where: {
        taskId, // Filter comments by the given taskId
        parentId: null, // Only include top-level comments
      },
      include: {
        author: true, // Include the author details for each comment
        replies: {
          include: {
            author: true, // Include the author details for each reply
            attachments: true, // Include any attachments for each reply
          },
        },
        attachments: true, // Include attachments for the top-level comments
      },
      orderBy: {
        createdAt: "desc", // Sort comments by creation date in descending order
      },
    });

    return comments; // Return the fetched comments
  } catch (error) {
    console.error("Error getting task comments:", error); // Log the error for debugging
    throw new Error("An error occurred while getting the comments."); // Throw a user-friendly error message
  }
}

// Function to get comments for a specific subtask
export async function getCommentsOnSubTask(subTaskId: string) {
  try {
    // Ensure the subTaskId is provided
    if (!subTaskId) {
      throw new Error("subTaskId is required.");
    }

    // Fetch comments for the subtask, including top-level comments only (no parentId)
    const comments = await db.comment.findMany({
      where: {
        subTaskId, // Filter comments by the given subTaskId
        parentId: null, // Only include top-level comments
      },
      include: {
        author: true, // Include the author details for each comment
        replies: {
          include: {
            author: true, // Include the author details for each reply
            attachments: true, // Include any attachments for each reply
          },
        },
        attachments: true, // Include attachments for the top-level comments
      },
      orderBy: {
        createdAt: "desc", // Sort comments by creation date in descending order
      },
    });

    return comments; // Return the fetched comments
  } catch (error) {
    console.error("Error getting subtask comments:", error); // Log the error for debugging
    throw new Error("An error occurred while getting the comments."); // Throw a user-friendly error message
  }
}
