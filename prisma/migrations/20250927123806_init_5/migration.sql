-- CreateTable
CREATE TABLE "public"."PerformanceAnalytics" (
    "id" TEXT NOT NULL,
    "analyticsId" TEXT NOT NULL,
    "dom_ready" INTEGER NOT NULL,
    "load_time" INTEGER NOT NULL,
    "network_latency" INTEGER NOT NULL,
    "processing_time" INTEGER NOT NULL,
    "total_time" INTEGER NOT NULL,

    CONSTRAINT "PerformanceAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PerformanceAnalytics_analyticsId_idx" ON "public"."PerformanceAnalytics"("analyticsId");

-- AddForeignKey
ALTER TABLE "public"."PerformanceAnalytics" ADD CONSTRAINT "PerformanceAnalytics_analyticsId_fkey" FOREIGN KEY ("analyticsId") REFERENCES "public"."Analytics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
