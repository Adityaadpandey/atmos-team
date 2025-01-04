"use server";

import { db } from "@/lib/db";

export async function createTask({
  title,
  description,
  deadline,
  teamId,
  assigneeEmails,
  priority = "MEDIUM", // Default priority
  tags,
}: {
  title: string;
  description?: string;
  deadline: string;
  teamId?: string;
  assigneeEmails?: string[];
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"; // Enum from schema
  tags?: string[]; // Array of tag names
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

    // Find or create tags
    const tagConnections = tags?.length
      ? await Promise.all(
        tags.map(async (tagName) => {
          const tag = await db.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName, color: "#000000" }, // Default color, update as needed
          });
          return { id: tag.id };
        })
      )
      : [];

    const taskData = {
      title,
      description: description || null,
      deadline: parsedDeadline,
      priority,
      team: teamId ? { connect: { id: teamId } } : undefined,
      assignees: {
        connect: users.map((user) => ({ id: user.id })),
      },
      tags: {
        connect: tagConnections,
      },
    };

    const newTask = await db.task.create({ data: taskData });
    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("An error occurred while creating the task.");
  }
}
