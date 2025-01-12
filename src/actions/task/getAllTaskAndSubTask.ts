"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getAllTaskAndSubTask() {
  const { userId } = await auth();
  try {
    if (!userId) {
      throw new Error("Valid user ID is required.");
    }

    // Fetch tasks where user is either assignee or creator
    const tasks = await db.task.findMany({
      where: {
        OR: [{ assignees: { some: { id: userId } } }],
      },
      select: {
        id: true,
        title: true,
        description: true,
        deadline: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        priority: true,
        startDate: true,
        completedAt: true,
        estimatedHours: true,
        actualHours: true,
        isArchived: true,

        // Related entities with selective fields
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
        team: {
          select: {
            id: true,
            name: true,
            description: true,
            department: true,
          },
        },
        comments: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            updatedAt: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
              },
            },
            attachments: {
              select: {
                id: true,
                name: true,
                url: true,
                type: true,
                size: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10, // Limit to latest 10 comments
        },
        subTasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
              },
            },
            estimatedHours: true,
            actualHours: true,
            completedAt: true,
            createdAt: true,
            updatedAt: true,
            comments: {
              select: {
                id: true,
                text: true,
                createdAt: true,
                author: {
                  select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 5, // Limit to latest 5 comments per subtask
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        relatedTasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            deadline: true,
          },
          take: 5, // Limit to 5 related tasks
        },
        attachments: {
          select: {
            id: true,
            name: true,
            url: true,
            type: true,
            size: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
    });

    if (!tasks.length) {
      return []; // Return empty array instead of throwing error for no tasks
    }

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch tasks and subtasks",
    );
  }
}
