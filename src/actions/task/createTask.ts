"use server";

import { db } from "@/lib/db";
import { TaskStatus, Priority } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

interface CreateTaskInput {
  title: string; // Task title
  description?: string; // Optional task description
  deadline: string; // Task deadline
  assigneeEmails?: string[]; // Emails of users to assign to the task
  priority?: Priority; // Task priority (default: MEDIUM)
}

export async function createTask(input: CreateTaskInput) {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid input data");
  }

  const {
    title,
    description,
    deadline,
    assigneeEmails = [], // Default to an empty array if no emails provided
    priority = Priority.MEDIUM, // Default to MEDIUM priority if not provided
  } = input;

  try {
    // Get the current user from Clerk
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be logged in to create tasks");
    }

    // Get the user from the database using Clerk userId
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

    // Parse deadline to ensure it's a valid date
    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      throw new Error("Invalid deadline date");
    }

    // Find assignee users by their emails
    const assignees =
      assigneeEmails.length > 0
        ? await db.user.findMany({
            where: { email: { in: assigneeEmails } },
            select: { id: true },
          })
        : [];

    // Create the task with the provided details
    const newTask = await db.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null, // If no description, set to null
        deadline: parsedDeadline,
        priority,
        status: TaskStatus.TODO, // Set initial status to TODO
        startDate: new Date(), // Set start date to current date
        creatorId: userId, // Use Clerk userId for the creator
        assignees:
          assignees.length > 0
            ? { connect: assignees.map((user) => ({ id: user.id })) } // Connect assignees if found
            : undefined, // If no assignees, don't include the assignees field
      },
      include: {
        assignees: true, // Include assignees in the response
        subTasks: true, // Include subtasks in the response
      },
    });

    return newTask; // Return the created task
  } catch (error) {
    console.error("Server error creating task:", error); // Log the error
    throw error instanceof Error ? error : new Error("Failed to create task"); // Throw the error
  }
}
