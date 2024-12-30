"use server";
import { db } from "@/lib/db";

export async function deleteSubTask(subTaskId: string) {
  try {
    const deletedSubTask = await db.subTask.delete({
      where: { id: subTaskId },
    });
    return deletedSubTask;
  } catch (error) {
    console.error("Error deleting subtask:", error);
    throw new Error("Failed to delete subtask");
  }
}
