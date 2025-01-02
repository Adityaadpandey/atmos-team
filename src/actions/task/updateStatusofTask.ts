"use server";

import { db } from "@/lib/db";
import { TaskStatus } from "@prisma/client";

export const updateStatusofTask = async (
  taskId: string,
  status: TaskStatus,
) => {
  try {
    await db.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: status,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateStatusofSubTask = async (
  taskId: string,
  status: TaskStatus,
) => {
  try {
    await db.subTask.update({
      where: {
        id: taskId,
      },
      data: {
        status: status,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
