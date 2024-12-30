"use server";

import { db } from "@/lib/db";

export interface SubTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  taskId: string;
}

export async function updateSubTask(
  subTaskId: string,
  updates: Partial<SubTask>,
) {
  try {
    const updatedSubTask = await db.subTask.update({
      where: { id: subTaskId },
      data: updates,
    });
    return updatedSubTask;
  } catch (error) {
    console.error("Error updating subtask:", error);
    throw new Error("Failed to update subtask");
  }
}
