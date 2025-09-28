/*
  Warnings:

  - A unique constraint covering the columns `[projectId,dom_ready,load_time,network_latency,processing_time,total_time]` on the table `PerformanceAnalytics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PerformanceAnalytics_projectId_dom_ready_load_time_network__key" ON "public"."PerformanceAnalytics"("projectId", "dom_ready", "load_time", "network_latency", "processing_time", "total_time");
