"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getAllTaskAndSubTask() {
  const { userId } = await auth();
  try {
    // Check if user ID is available
    if (!userId) {
      throw new Error("Valid user ID is required.");
    }

    // Fetch tasks where the user is either assignee or creator
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

        // Include related entities (assignees, creator, team, comments, subTasks, etc.)
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
            createdAt: "desc", // Sort comments by most recent
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
                createdAt: "desc", // Sort comments by most recent
              },
              take: 5, // Limit to latest 5 comments per subtask
            },
          },
          orderBy: {
            createdAt: "asc", // Sort subtasks by creation date
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
            createdAt: "desc", // Sort attachments by most recent
          },
        },
      },
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }], // Sort tasks by deadline and creation date
    });

    // If no tasks found, return an empty array
    if (!tasks.length) {
      return [];
    }

    return tasks; // Return the fetched tasks
  } catch (error) {
    console.error("Error fetching tasks:", error); // Log the error
    throw new Error(
      error instanceof Error
        ? error.message // Provide the error message if it's an instance of Error
        : "Failed to fetch tasks and subtasks", // Provide a default error message
    );
  }
}
