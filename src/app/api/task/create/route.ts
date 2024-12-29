import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const db = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { title, description, deadline, teamId, assigneeIds } = body;

    // Validate required fields
    if (!title || !deadline) {
      return NextResponse.json(
        { error: "Title and deadline are required." },
        { status: 400 },
      );
    }

    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      return NextResponse.json(
        { error: "Invalid deadline format. Please provide a valid date." },
        { status: 400 },
      );
    }

    // Prepare task data
    const taskData = {
      title,
      description: description || null,
      deadline: parsedDeadline,
      team: teamId ? { connect: { id: teamId } } : undefined,
      assignees: {
        connect: assigneeIds?.map((userId: string) => ({ id: userId })) || [],
      },
    };

    console.log("Task data being created:", taskData);

    // Create the task
    const newTask = await db.task.create({ data: taskData });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the task." },
      { status: 500 },
    );
  }
}
