import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const db = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taskId, title, status } = body;
    console.log("Request body:", body);

    // Validate required fields
    if (!taskId || !title) {
      return NextResponse.json(
        { error: "Task ID and title are required." },
        { status: 400 },
      );
    }

    // Check if the task with the given taskId exists
    const parentTask = await db.task.findUnique({
      where: { id: taskId },
    });

    if (!parentTask) {
      return NextResponse.json(
        { error: "The provided Task ID does not exist." },
        { status: 400 },
      );
    }

    // Create the subtask
    const subTask = {
      title,
      taskId,
      status: status || "TODO", // Ensure default status is TODO
    };

    console.log("Subtask data being created:", subTask);

    const newSubTask = await db.subTask.create({ data: subTask });

    return NextResponse.json(newSubTask, { status: 201 });
  } catch (error) {
    console.error(
      "Error creating subtask:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "An error occurred while creating the subtask." },
      { status: 500 },
    );
  }
}
