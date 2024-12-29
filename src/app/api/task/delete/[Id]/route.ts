import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const db = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // asynchronous access of `params.id
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required." },
        { status: 400 },
      );
    }

    // Delete the task
    const deletedTask = await db.task.delete({
      where: { id },
    });

    return NextResponse.json(deletedTask, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the task." },
      { status: 500 },
    );
  }
}
