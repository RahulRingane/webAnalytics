-- DropForeignKey
ALTER TABLE "BugReport" DROP CONSTRAINT "BugReport_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Check" DROP CONSTRAINT "Check_projectId_fkey";

-- DropForeignKey
ALTER TABLE "incidents" DROP CONSTRAINT "incidents_projectId_fkey";

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
