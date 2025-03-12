/*
  Warnings:

  - You are about to drop the `DocumentLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebhookEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DocumentLink" DROP CONSTRAINT "DocumentLink_fromProject_fkey";

-- DropForeignKey
ALTER TABLE "DocumentLink" DROP CONSTRAINT "DocumentLink_fromTask_fkey";

-- DropForeignKey
ALTER TABLE "DocumentLink" DROP CONSTRAINT "DocumentLink_toProject_fkey";

-- DropForeignKey
ALTER TABLE "DocumentLink" DROP CONSTRAINT "DocumentLink_toTask_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assignedToId_fkey";

-- DropTable
DROP TABLE "DocumentLink";

-- DropTable
DROP TABLE "WebhookEvent";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
