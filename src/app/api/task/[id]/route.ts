// app/api/task/[id]/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Handler for GET requests to retrieve a specific task by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
      // asynchronous access of `params.id`.

    const { id } = params; // No need to await params; it is already available

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required." },
        { status: 400 },
      );
    }

    // Fetch task details using findUnique
    const task = await db.task.findUnique({
      where: { id },
      include: {
        assignees: {
          select: { id: true, name: true, email: true },
        },
        team: true,
        subTasks: true,
        comments: { include: { author: true } },
        timeline: { include: { previousTask: true, nextTask: true } },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: `Task with ID ${id} not found.` },
        { status: 404 },
      );
    }

    return NextResponse.json(task, { status: 200 });
  } catch {
    console.error("Error retrieving task"); // Improved error logging
    return NextResponse.json(
      { error: "An error occurred while retrieving the task." },
      { status: 500 },
    );
  }
}
