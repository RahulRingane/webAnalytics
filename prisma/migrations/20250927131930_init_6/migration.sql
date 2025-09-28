/*
  Warnings:

  - You are about to drop the column `analyticsId` on the `PerformanceAnalytics` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `PerformanceAnalytics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."PerformanceAnalytics" DROP CONSTRAINT "PerformanceAnalytics_analyticsId_fkey";

-- DropIndex
DROP INDEX "public"."PerformanceAnalytics_analyticsId_idx";

-- AlterTable
ALTER TABLE "public"."PerformanceAnalytics" DROP COLUMN "analyticsId",
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "PerformanceAnalytics_projectId_timestamp_idx" ON "public"."PerformanceAnalytics"("projectId", "timestamp" DESC);

-- AddForeignKey
ALTER TABLE "public"."PerformanceAnalytics" ADD CONSTRAINT "PerformanceAnalytics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
