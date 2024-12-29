import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const db = {
  user: {
    findUnique: async (where: Prisma.UserWhereUniqueInput) => {
      try {
        return await prisma.user.findUnique({ where });
      } catch (error) {
        console.error("Error finding user:", error);
        throw error;
      }
    },
    findMany: async (args?: Prisma.UserFindManyArgs) => {
      try {
        return await prisma.user.findMany(args || {});
      } catch (error) {
        console.error("Error finding users:", error);
        throw error;
      }
    },
    upsert: async (params: Prisma.UserUpsertArgs) => {
      try {
        return await prisma.user.upsert(params);
      } catch (error) {
        console.error("Error upserting user:", error);
        throw error;
      }
    },
    delete: async (where: Prisma.UserWhereUniqueInput) => {
      try {
        return await prisma.user.delete({ where });
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },
  },
  team: {
    create: async (data: Prisma.TeamCreateInput) => {
      try {
        return await prisma.team.create({ data });
      } catch (error) {
        console.error("Error creating team:", error);
        throw error;
      }
    },
    findUnique: async (where: Prisma.TeamWhereUniqueInput) => {
      try {
        return await prisma.team.findUnique({ where });
      } catch (error) {
        console.error("Error finding team:", error);
        throw error;
      }
    },
    findMany: async (args?: Prisma.TeamFindManyArgs) => {
      try {
        return await prisma.team.findMany(args || {});
      } catch (error) {
        console.error("Error finding teams:", error);
        throw error;
      }
    },
    update: async (
      where: Prisma.TeamWhereUniqueInput,
      data: Prisma.TeamUpdateInput,
    ) => {
      try {
        return await prisma.team.update({ where, data });
      } catch (error) {
        console.error("Error updating team:", error);
        throw error;
      }
    },
    delete: async (where: Prisma.TeamWhereUniqueInput) => {
      try {
        return await prisma.team.delete({ where });
      } catch (error) {
        console.error("Error deleting team:", error);
        throw error;
      }
    },
  },
  task: {
    create: async (data: Prisma.TaskCreateInput) => {
      try {
        return await prisma.task.create({ data });
      } catch (error) {
        console.log("Error creating task:");
        throw error;
      }
    },
    findUnique: async (where: Prisma.TaskWhereUniqueInput) => {
      try {
        return await prisma.task.findUnique({ where });
      } catch (error) {
        console.error("Error finding task:", error);
        throw error;
      }
    },
    findMany: async (args?: Prisma.TaskFindManyArgs) => {
      try {
        return await prisma.task.findMany(args || {});
      } catch (error) {
        console.error("Error finding tasks:", error);
        throw error;
      }
    },
    update: async (
      where: Prisma.TaskWhereUniqueInput,
      data: Prisma.TaskUpdateInput,
    ) => {
      try {
        return await prisma.task.update({ where, data });
      } catch (error) {
        console.error("Error updating task:", error);
        throw error;
      }
    },
    delete: async (where: Prisma.TaskWhereUniqueInput) => {
      try {
        return await prisma.task.delete({ where });
      } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
      }
    },
  },
  subTask: {
    create: async (data: Prisma.SubTaskCreateInput) => {
      try {
        return await prisma.subTask.create({ data });
      } catch (error) {
        console.error("Error creating subTask:", error);
        throw error;
      }
    },
    findUnique: async (where: Prisma.SubTaskWhereUniqueInput) => {
      try {
        return await prisma.subTask.findUnique({ where });
      } catch (error) {
        console.error("Error finding subTask:", error);
        throw error;
      }
    },
    findMany: async (args?: Prisma.SubTaskFindManyArgs) => {
      try {
        return await prisma.subTask.findMany(args || {});
      } catch (error) {
        console.error("Error finding subTasks:", error);
        throw error;
      }
    },
    update: async (
      where: Prisma.SubTaskWhereUniqueInput,
      data: Prisma.SubTaskUpdateInput,
    ) => {
      try {
        return await prisma.subTask.update({ where, data });
      } catch (error) {
        console.error("Error updating subTask:", error);
        throw error;
      }
    },
    delete: async (where: Prisma.SubTaskWhereUniqueInput) => {
      try {
        return await prisma.subTask.delete({ where });
      } catch (error) {
        console.error("Error deleting subTask:", error);
        throw error;
      }
    },
  },
  comment: {
    create: async (data: Prisma.CommentCreateInput) => {
      try {
        return await prisma.comment.create({ data });
      } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
      }
    },
    findUnique: async (where: Prisma.CommentWhereUniqueInput) => {
      try {
        return await prisma.comment.findUnique({ where });
      } catch (error) {
        console.error("Error finding comment:", error);
        throw error;
      }
    },
    findMany: async (args?: Prisma.CommentFindManyArgs) => {
      try {
        return await prisma.comment.findMany(args || {});
      } catch (error) {
        console.error("Error finding comments:", error);
        throw error;
      }
    },
    update: async (
      where: Prisma.CommentWhereUniqueInput,
      data: Prisma.CommentUpdateInput,
    ) => {
      try {
        return await prisma.comment.update({ where, data });
      } catch (error) {
        console.error("Error updating comment:", error);
        throw error;
      }
    },
    delete: async (where: Prisma.CommentWhereUniqueInput) => {
      try {
        return await prisma.comment.delete({ where });
      } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
      }
    },
  },
  timeline: {
    create: async (data: Prisma.TimelineCreateInput) => {
      try {
        return await prisma.timeline.create({ data });
      } catch (error) {
        console.error("Error creating timeline:", error);
        throw error;
      }
    },
    findUnique: async (where: Prisma.TimelineWhereUniqueInput) => {
      try {
        return await prisma.timeline.findUnique({ where });
      } catch (error) {
        console.error("Error finding timeline:", error);
        throw error;
      }
    },
    findMany: async (args?: Prisma.TimelineFindManyArgs) => {
      try {
        return await prisma.timeline.findMany(args || {});
      } catch (error) {
        console.error("Error finding timelines:", error);
        throw error;
      }
    },
    update: async (
      where: Prisma.TimelineWhereUniqueInput,
      data: Prisma.TimelineUpdateInput,
    ) => {
      try {
        return await prisma.timeline.update({ where, data });
      } catch (error) {
        console.error("Error updating timeline:", error);
        throw error;
      }
    },
    delete: async (where: Prisma.TimelineWhereUniqueInput) => {
      try {
        return await prisma.timeline.delete({ where });
      } catch (error) {
        console.error("Error deleting timeline:", error);
        throw error;
      }
    },
  },
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisma disconnected");
  process.exit(0);
});
