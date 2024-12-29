// app/api/backlog/route.ts

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const db = new PrismaClient();

export async function GET() {
  try {
    // Fetch all tasks with status 'BACKLOG'
    const backlogTasks = await db.task.findMany({
      where: { status: "BACKLOG" },
    });

    return NextResponse.json(backlogTasks, { status: 200 });
  } catch (error) {
    console.error("Error retrieving backlog tasks:", error);
    return NextResponse.json(
      { error: "An error occurred while retrieving backlog tasks." },
      { status: 500 },
    );
  }
}
