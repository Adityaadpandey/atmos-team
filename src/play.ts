import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const jo = async () => {
  const task = await prisma.task.findUnique({
    where: { id: "cm59lsr3q0003iusbke0qn7he" },
  });
  console.log(task);
};

jo();
