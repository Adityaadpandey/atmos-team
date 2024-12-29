import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { taskId, assigneeId } = body;

    // Validate required fields
    if (!taskId || !assigneeId) {
      return NextResponse.json(
        { error: "Task ID and assignee ID are required." },
        { status: 400 },
      );
    }

    // Update the task to disconnect the assignee
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        assignees: {
          disconnect: { id: assigneeId },
        },
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch {
    console.error("Error removing assignee from task:");
    return NextResponse.json(
      { error: "An error occurred while removing the assignee from the task." },
      { status: 500 },
    );
  }
}
