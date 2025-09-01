 import { Worker } from "bullmq";
import { createClient } from "redis";
import prisma from "@/lib/db";

// Redis connection options for BullMQ
const redisOptions = {
  url: process.env.REDIS_URL,
};

// In-memory buffer to batch jobs for DB
let checkBuffer: Array<{ url: string; status: string }> = [];

// Worker B – consumes completed jobs from Worker A's queue
const workerB = new Worker(
  "website-uptime",
  async (job) => {
    const result = job.returnvalue as { url: string; status: string };
    if (!result) return;

    // Collect in buffer
    checkBuffer.push(result);
    console.log(`📥 Buffered check: ${result.url} -> ${result.status}`);
  },
  { connection: redisOptions } // ✅ pass config, not client
);

// Flush buffered results to DB every 5 minutes
setInterval(async () => {
  if (checkBuffer.length === 0) return;

  const toFlush = [...checkBuffer];
  checkBuffer = [];

  console.log(`🚀 Flushing ${toFlush.length} checks to DB...`);

  for (const check of toFlush) {
    try {
      const project = await prisma.project.findFirst({ where: { domain: check.url.replace(/^https?:\/\//, '') } });
      if (!project) continue;

      const isUp = check.status === "up";

      await prisma.check.create({
        data: {
          projectId: project.id,
          status: isUp ? "up" : "down",
          responseTime: 0,
          statusCode: isUp ? 200 : 500,
        },
      });

      await prisma.project.update({
        where: { id: project.id },
        data: { lastChecked: new Date(), status: isUp ? "up" : "down" },
      });

      if (!isUp) {
        await prisma.incident.create({
          data: { projectId: project.id, startTime: new Date(), reason: "Uptime check failed" },
        });
      } else {
        const unresolved = await prisma.incident.findFirst({ where: { projectId: project.id, resolved: false } });
        if (unresolved) {
          const endTime = new Date();
          const duration = (endTime.getTime() - unresolved.startTime.getTime()) / 1000;

          await prisma.incident.update({
            where: { id: unresolved.id },
            data: { endTime, duration, resolved: true },
          });
        }
      }

      console.log(`✅ Flushed check for ${project.name}`);
    } catch (err) {
      console.error(`❌ Failed to flush check for ${check.url}:`, err);
    }
  }
}, 5 * 60 * 1000);

console.log("Worker B running... batching results from Worker A");
