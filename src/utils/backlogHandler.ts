import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function moveMissedDeadlineTasksToBacklog() {
  const currentDate = new Date();

  try {
    const overdueTasks = await db.task.updateMany({
      where: {
        deadline: { lt: currentDate }, // Tasks with deadlines before now
        status: { not: "BACKLOG" }, // Exclude already backlogged tasks
      },
      data: {
        status: "BACKLOG",
      },
    });

    console.log("Overdue tasks moved to backlog:", overdueTasks);
  } catch (error) {
    console.error("Error moving overdue tasks to backlog:", error);
  }
}
