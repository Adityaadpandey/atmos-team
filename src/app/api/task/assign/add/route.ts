import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const db = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Request body:", body);

        const { taskId, assigneeIds } = body;

        // Validate required fields
        if (!taskId || !assigneeIds?.length) {
        return NextResponse.json(
            { error: "Task ID and assignee IDs are required." },
            { status: 400 }
        );
        }

        // Prepare task data
        const taskData = {
        id: taskId,
        assignees: {
            connect: assigneeIds.map((userId: string) => ({ id: userId })),
        },
        };

        console.log("Task data being updated:", taskData);

        // Update the task
        const updatedTask = await db.task.update({
        where: { id: taskId },
        data: taskData,
        });

        return NextResponse.json(updatedTask, { status: 200 });
    } catch (error) {
        console.error("Error assigning task:", error);
        return NextResponse.json(
        { error: "An error occurred while assigning the task." },
        { status: 500 }
        );
    }
    }
