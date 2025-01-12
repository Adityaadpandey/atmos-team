"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getLatestTask() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Valid user ID is required.");
    }
    const tasks = db.task.findMany({
      where: {
        OR: [{ assignees: { some: { id: userId } } }, { creatorId: userId }],
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return tasks;
  } catch (err) {
    console.log(err);
  }
}
