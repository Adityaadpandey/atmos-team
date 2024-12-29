// app/api/tasks/[id]/backlog/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const db = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // asynchronous access of `params.id`.

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required." },
        { status: 400 },
      );
    }

    // Update task status to backlog
    const updatedTask = await db.task.update({
      where: { id },
      data: {
        status: "BACKLOG",
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error moving task to backlog:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the task." },
      { status: 500 },
    );
  }
}
