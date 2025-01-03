"use server";

import { db } from "@/lib/db";

export async function createTask({
  title,
  description,
  deadline,
  teamId,
  assigneeEmails,
}: {
  title: string;
  description?: string;
  deadline: string;
  teamId?: string;
  assigneeEmails?: string[];
}) {
  try {
    if (!title || !deadline) {
      throw new Error("Title and deadline are required.");
    }

    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      throw new Error("Invalid deadline format.");
    }

    // Find users by email
    const users = assigneeEmails?.length
      ? await db.user.findMany({
          where: {
            email: {
              in: assigneeEmails,
            },
          },
          select: {
            id: true,
          },
        })
      : [];

    const taskData = {
      title,
      description: description || null,
      deadline: parsedDeadline,
      team: teamId ? { connect: { id: teamId } } : undefined,
      assignees: {
        connect: users.map((user) => ({ id: user.id })),
      },
    };

    const newTask = await db.task.create({ data: taskData });
    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("An error occurred while creating the task.");
  }
}
