import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const db = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } },
) {
  try {
    // asynchronous access of `params.id`.

    const { teamId } = params;

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required." },
        { status: 400 },
      );
    }

    const team = await db.team.findMany({
      where: { id: teamId },
      include: {
        tasks: {
          include: {
            assignees: {
              select: { id: true, name: true, email: true },
            },
            team: true,
            subTasks: true,
            comments: { include: { author: true } },
            timeline: { include: { previousTask: true, nextTask: true } },
          },
        },
      },
    });
    if (!team) {
      return NextResponse.json(
        { error: `Team with ID ${teamId} not found.` },
        { status: 404 },
      );
    }

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.error("Error assigning task:", error);
    return NextResponse.json(
      { error: "An error occurred while assigning the task." },
      { status: 500 },
    );
  }
}
