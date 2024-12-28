import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const db = {
  user: {
    create: (data: Prisma.UserCreateInput) => prisma.user.create({ data }),
    findUnique: (where: Prisma.UserWhereUniqueInput) =>
      prisma.user.findUnique({ where }),
    findMany: (args: Prisma.UserFindManyArgs) => prisma.user.findMany(args),
    update: (
      where: Prisma.UserWhereUniqueInput,
      data: Prisma.UserUpdateInput,
    ) => prisma.user.update({ where, data }),
    upsert: (params: Prisma.UserUpsertArgs) => prisma.user.upsert(params),
    delete: (where: Prisma.UserWhereUniqueInput) =>
      prisma.user.delete({ where }),
  },
  team: {
    create: (data: Prisma.TeamCreateInput) => prisma.team.create({ data }),
    findUnique: (where: Prisma.TeamWhereUniqueInput) =>
      prisma.team.findUnique({ where }),
    findMany: (args: Prisma.TeamFindManyArgs) => prisma.team.findMany(args),
    update: (
      where: Prisma.TeamWhereUniqueInput,
      data: Prisma.TeamUpdateInput,
    ) => prisma.team.update({ where, data }),
    delete: (where: Prisma.TeamWhereUniqueInput) =>
      prisma.team.delete({ where }),
  },
  task: {
    create: (data: Prisma.TaskCreateInput) => prisma.task.create({ data }),
    findUnique: (where: Prisma.TaskWhereUniqueInput) =>
      prisma.task.findUnique({ where }),
    findMany: (args: Prisma.TaskFindManyArgs) => prisma.task.findMany(args),
    update: (
      where: Prisma.TaskWhereUniqueInput,
      data: Prisma.TaskUpdateInput,
    ) => prisma.task.update({ where, data }),
    delete: (where: Prisma.TaskWhereUniqueInput) =>
      prisma.task.delete({ where }),
  },
  subTask: {
    create: (data: Prisma.SubTaskCreateInput) =>
      prisma.subTask.create({ data }),
    findUnique: (where: Prisma.SubTaskWhereUniqueInput) =>
      prisma.subTask.findUnique({ where }),
    findMany: (args: Prisma.SubTaskFindManyArgs) =>
      prisma.subTask.findMany(args),
    update: (
      where: Prisma.SubTaskWhereUniqueInput,
      data: Prisma.SubTaskUpdateInput,
    ) => prisma.subTask.update({ where, data }),
    delete: (where: Prisma.SubTaskWhereUniqueInput) =>
      prisma.subTask.delete({ where }),
  },
  comment: {
    create: (data: Prisma.CommentCreateInput) =>
      prisma.comment.create({ data }),
    findUnique: (where: Prisma.CommentWhereUniqueInput) =>
      prisma.comment.findUnique({ where }),
    findMany: (args: Prisma.CommentFindManyArgs) =>
      prisma.comment.findMany(args),
    update: (
      where: Prisma.CommentWhereUniqueInput,
      data: Prisma.CommentUpdateInput,
    ) => prisma.comment.update({ where, data }),
    delete: (where: Prisma.CommentWhereUniqueInput) =>
      prisma.comment.delete({ where }),
  },
  timeline: {
    create: (data: Prisma.TimelineCreateInput) =>
      prisma.timeline.create({ data }),
    findUnique: (where: Prisma.TimelineWhereUniqueInput) =>
      prisma.timeline.findUnique({ where }),
    findMany: (args: Prisma.TimelineFindManyArgs) =>
      prisma.timeline.findMany(args),
    update: (
      where: Prisma.TimelineWhereUniqueInput,
      data: Prisma.TimelineUpdateInput,
    ) => prisma.timeline.update({ where, data }),
    delete: (where: Prisma.TimelineWhereUniqueInput) =>
      prisma.timeline.delete({ where }),
  },
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisma disconnected");
});
