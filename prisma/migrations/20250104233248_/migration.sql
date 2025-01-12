/*
  Warnings:

  - You are about to drop the `Timeline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeamMembers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SubTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ViewType" AS ENUM ('LIST', 'BOARD', 'CALENDAR', 'TIMELINE', 'GANTT');

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'GUEST');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'AWAY', 'DO_NOT_DISTURB');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TASK_ASSIGNED', 'TASK_UPDATED', 'TASK_COMPLETED', 'COMMENT_ADDED', 'DEADLINE_APPROACHING', 'TEAM_INVITATION', 'MENTION');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'TEAM_ONLY');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'VIEWER';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TaskStatus" ADD VALUE 'IN_REVIEW';
ALTER TYPE "TaskStatus" ADD VALUE 'BLOCKED';
ALTER TYPE "TaskStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_subTaskId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "SubTask" DROP CONSTRAINT "SubTask_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Timeline" DROP CONSTRAINT "Timeline_nextTaskId_fkey";

-- DropForeignKey
ALTER TABLE "Timeline" DROP CONSTRAINT "Timeline_previousTaskId_fkey";

-- DropForeignKey
ALTER TABLE "Timeline" DROP CONSTRAINT "Timeline_taskId_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_B_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SubTask" ADD COLUMN     "actualHours" DOUBLE PRECISION,
ADD COLUMN     "assigneeId" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "estimatedHours" DOUBLE PRECISION,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "actualHours" DOUBLE PRECISION,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "estimatedHours" DOUBLE PRECISION,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "startDate" TIMESTAMP(3),
ALTER COLUMN "deadline" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "department" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT,
ADD COLUMN     "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "Timeline";

-- DropTable
DROP TABLE "_TeamMembers";

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceTeam" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamSettings" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "defaultAssigneeId" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "autoAssignment" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TeamSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "taskId" TEXT,
    "commentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TeamSettingsManager" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamSettingsManager_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "WorkspaceMember_userId_idx" ON "WorkspaceMember"("userId");

-- CreateIndex
CREATE INDEX "WorkspaceMember_workspaceId_idx" ON "WorkspaceMember"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- CreateIndex
CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId");

-- CreateIndex
CREATE INDEX "TeamMember_teamId_idx" ON "TeamMember"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

-- CreateIndex
CREATE INDEX "WorkspaceTeam_teamId_idx" ON "WorkspaceTeam"("teamId");

-- CreateIndex
CREATE INDEX "WorkspaceTeam_workspaceId_idx" ON "WorkspaceTeam"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceTeam_workspaceId_teamId_key" ON "WorkspaceTeam"("workspaceId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamSettings_teamId_key" ON "TeamSettings"("teamId");

-- CreateIndex
CREATE INDEX "TeamSettings_defaultAssigneeId_idx" ON "TeamSettings"("defaultAssigneeId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Attachment_taskId_idx" ON "Attachment"("taskId");

-- CreateIndex
CREATE INDEX "Attachment_commentId_idx" ON "Attachment"("commentId");

-- CreateIndex
CREATE INDEX "_TeamSettingsManager_B_index" ON "_TeamSettingsManager"("B");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_taskId_idx" ON "Comment"("taskId");

-- CreateIndex
CREATE INDEX "Comment_subTaskId_idx" ON "Comment"("subTaskId");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "SubTask_taskId_idx" ON "SubTask"("taskId");

-- CreateIndex
CREATE INDEX "SubTask_assigneeId_idx" ON "SubTask"("assigneeId");

-- CreateIndex
CREATE INDEX "Task_creatorId_idx" ON "Task"("creatorId");

-- CreateIndex
CREATE INDEX "Task_teamId_idx" ON "Task"("teamId");

-- CreateIndex
CREATE INDEX "Team_ownerId_idx" ON "Team"("ownerId");

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceTeam" ADD CONSTRAINT "WorkspaceTeam_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceTeam" ADD CONSTRAINT "WorkspaceTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamSettings" ADD CONSTRAINT "TeamSettings_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamSettings" ADD CONSTRAINT "TeamSettings_defaultAssigneeId_fkey" FOREIGN KEY ("defaultAssigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_subTaskId_fkey" FOREIGN KEY ("subTaskId") REFERENCES "SubTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamSettingsManager" ADD CONSTRAINT "_TeamSettingsManager_A_fkey" FOREIGN KEY ("A") REFERENCES "TeamSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamSettingsManager" ADD CONSTRAINT "_TeamSettingsManager_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
