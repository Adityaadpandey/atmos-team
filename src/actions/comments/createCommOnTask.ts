import { db } from "@/lib/db";

export async function createCommentOnTask(taskId: string, text: string) {
  try {
    if (!text) {
      throw new Error("Text is required.");
    }
    if (!taskId) {
      throw new Error("TaskId is required.");
    }

    const commentData = {
      text,
      task: { connect: { id: taskId } },
      author: { connect: { id: "authorId" } }, // replace "authorId" with the actual author ID
    };

    const newComment = await db.comment.create({ data: commentData });

    return newComment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("An error occurred while creating the comment.");
  }
}
