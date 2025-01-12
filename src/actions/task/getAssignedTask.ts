"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const getAssignedTask = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be logged in to create tasks");
    }
    const tasks = await db.task.findMany({
      where: {
        assignees: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        assignees: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });
    return tasks;
  } catch (err) {
    console.log("Can't get the assigned tasks of the user", err);
  }
};
