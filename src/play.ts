import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const jo = async () => {
  const task = await prisma.task.findUnique({
    where: { id: "cm59lsr3q0003iusbke0qn7he" },
  });
  console.log(task);
};

jo();

const moveSubtask = async (
  subtask: SubTask,
  newStatus: TaskStatus,
): Promise<void> => {
  if (!task) return;

  // Store the original status for rollback
  const originalStatus = subtask.status;
  // Optimistic update
  setTask((prevTask: TaskMain | null) => {
    if (!prevTask) return null;
    return {
      ...prevTask,
      subTasks: prevTask.subTasks?.map((st) =>
        st.id === subtask.id ? { ...st, status: newStatus } : st,
      ),
    };
  });

  try {
    await updateStatusofSubTask(subtask.id, newStatus);
  } catch (error) {
    // Rollback on error
    console.error("Failed to update subtask status:", error);
    setTask((prevTask: Task | null) => {
      if (!prevTask) return null;
      return {
        ...prevTask,
        subTasks: prevTask.subTasks?.map((st) =>
          st.id === subtask.id ? { ...st, status: originalStatus } : st,
        ),
      };
    });
    throw new Error("Failed to update subtask status");
  }
};
