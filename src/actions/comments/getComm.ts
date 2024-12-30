import { db } from "@/lib/db";

export async function getCommentsOnTask(taskId: string) {
  try {
    if (!taskId) {
      throw new Error("taskId is required.");
    }

    const comments = await db.comment.findMany({
      where: { task: { id: taskId } },
      include: { author: true },
    });

    return comments;
  } catch (error) {
    console.error("Error getting comments:", error);
    throw new Error("An error occurred while getting the comments.");
  }
}

export async function getCommentsOnSubTask(taskId: string) {
  try {
    if (!taskId) {
      throw new Error("taskId is required.");
    }

    const comments = await db.comment.findMany({
      where: { task: { id: taskId } },
      include: { author: true },
    });

    return comments;
  } catch (error) {
    console.error("Error getting comments:", error);
    throw new Error("An error occurred while getting the comments.");
  }
}
