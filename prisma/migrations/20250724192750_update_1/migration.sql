-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('DESKTOP', 'MOBILE', 'TABLET');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "totalPageVisits" INTEGER NOT NULL DEFAULT 0,
    "totalVisitors" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitData" (
    "id" TEXT NOT NULL,
    "analyticsId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "pageVisits" INTEGER NOT NULL DEFAULT 0,
    "visitors" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VisitData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteAnalytics" (
    "id" TEXT NOT NULL,
    "analyticsId" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "visitors" INTEGER NOT NULL DEFAULT 0,
    "pageVisits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RouteAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryAnalytics" (
    "id" TEXT NOT NULL,
    "analyticsId" TEXT NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "countryName" TEXT NOT NULL,
    "visitors" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CountryAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceAnalytics" (
    "id" TEXT NOT NULL,
    "analyticsId" TEXT NOT NULL,
    "deviceType" "DeviceType" NOT NULL,
    "visitors" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DeviceAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OSAnalytics" (
    "id" TEXT NOT NULL,
    "analyticsId" TEXT NOT NULL,
    "osName" TEXT NOT NULL,
    "visitors" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OSAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceAnalytics" (
    "id" TEXT NOT NULL,
    "analyticsId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "visitors" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SourceAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_domain_key" ON "Project"("domain");

-- CreateIndex
CREATE INDEX "Project_ownerId_idx" ON "Project"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_projectId_key" ON "Analytics"("projectId");

-- CreateIndex
CREATE INDEX "VisitData_analyticsId_idx" ON "VisitData"("analyticsId");

-- CreateIndex
CREATE INDEX "VisitData_date_idx" ON "VisitData"("date");

-- CreateIndex
CREATE UNIQUE INDEX "VisitData_analyticsId_date_key" ON "VisitData"("analyticsId", "date");

-- CreateIndex
CREATE INDEX "RouteAnalytics_analyticsId_idx" ON "RouteAnalytics"("analyticsId");

-- CreateIndex
CREATE UNIQUE INDEX "RouteAnalytics_analyticsId_route_key" ON "RouteAnalytics"("analyticsId", "route");

-- CreateIndex
CREATE INDEX "CountryAnalytics_analyticsId_idx" ON "CountryAnalytics"("analyticsId");

-- CreateIndex
CREATE UNIQUE INDEX "CountryAnalytics_analyticsId_countryCode_key" ON "CountryAnalytics"("analyticsId", "countryCode");

-- CreateIndex
CREATE INDEX "DeviceAnalytics_analyticsId_idx" ON "DeviceAnalytics"("analyticsId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceAnalytics_analyticsId_deviceType_key" ON "DeviceAnalytics"("analyticsId", "deviceType");

-- CreateIndex
CREATE INDEX "OSAnalytics_analyticsId_idx" ON "OSAnalytics"("analyticsId");

-- CreateIndex
CREATE UNIQUE INDEX "OSAnalytics_analyticsId_osName_key" ON "OSAnalytics"("analyticsId", "osName");

-- CreateIndex
CREATE INDEX "SourceAnalytics_analyticsId_idx" ON "SourceAnalytics"("analyticsId");

-- CreateIndex
CREATE UNIQUE INDEX "SourceAnalytics_analyticsId_sourceName_key" ON "SourceAnalytics"("analyticsId", "sourceName");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitData" ADD CONSTRAINT "VisitData_analyticsId_fkey" FOREIGN KEY ("analyticsId") REFERENCES "Analytics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteAnalytics" ADD CONSTRAINT "RouteAnalytics_analyticsId_fkey" FOREIGN KEY ("analyticsId") REFERENCES "Analytics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryAnalytics" ADD CONSTRAINT "CountryAnalytics_analyticsId_fkey" FOREIGN KEY ("analyticsId") REFERENCES "Analytics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceAnalytics" ADD CONSTRAINT "DeviceAnalytics_analyticsId_fkey" FOREIGN KEY ("analyticsId") REFERENCES "Analytics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OSAnalytics" ADD CONSTRAINT "OSAnalytics_analyticsId_fkey" FOREIGN KEY ("analyticsId") REFERENCES "Analytics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceAnalytics" ADD CONSTRAINT "SourceAnalytics_analyticsId_fkey" FOREIGN KEY ("analyticsId") REFERENCES "Analytics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
