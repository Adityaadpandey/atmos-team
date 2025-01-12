"use server";

import { db } from "@/lib/db";
import { TaskStatus, Priority } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

interface CreateTaskInput {
  title: string;
  description?: string;
  deadline: string;
  assigneeEmails?: string[];
  priority?: Priority;
}

export async function createTask(input: CreateTaskInput) {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid input data");
  }

  const {
    title,
    description,
    deadline,
    assigneeEmails = [],
    priority = Priority.MEDIUM,
  } = input;

  try {
    // Get the current user from Clerk
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be logged in to create tasks");
    }

    // Get the user from your database using Clerk userId
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found in the database");
    }

    // Validate required fields
    if (!title?.trim()) {
      throw new Error("Task title is required");
    }

    if (!deadline) {
      throw new Error("Deadline is required");
    }

    // Parse deadline
    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      throw new Error("Invalid deadline date");
    }

    // Find assignee users
    const assignees =
      assigneeEmails.length > 0
        ? await db.user.findMany({
            where: { email: { in: assigneeEmails } },
            select: { id: true },
          })
        : [];

    // Create the task
    const newTask = await db.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        deadline: parsedDeadline,
        priority,
        status: TaskStatus.TODO,
        startDate: new Date(),
        creatorId: userId, // Using Clerk userId
        assignees:
          assignees.length > 0
            ? { connect: assignees.map((user) => ({ id: user.id })) }
            : undefined,
      },
      include: {
        assignees: true,
        subTasks: true,
      },
    });

    return newTask;
  } catch (error) {
    console.error("Server error creating task:", error);
    throw error instanceof Error ? error : new Error("Failed to create task");
  }
}
