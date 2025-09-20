"use client";

import React, { useEffect, useState } from "react";
import type { Project, WsUpdate } from "@/types";
import { Check } from "@prisma/client";

interface UptimeCardProps {
  project: Project;
}

const MAX_TICKS = 30;
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || " ";

const UptimeCard: React.FC<UptimeCardProps> = ({ project }) => {
  const [status, setStatus] = useState(project.status);
  const [checks, setChecks] = useState<string[]>(
    Array(MAX_TICKS - 1).fill("unknown"),
  ); // recent 29 from API
  const [lastChecked, setLastChecked] = useState(project.lastChecked);

  // Fetch recent 29 ticks on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/project/${project.id}/uptime?limit=29`);
        if (!res.ok) throw new Error("Failed to fetch recent ticks");
        const data = await res.json();
        const recentStatuses = data.checks
          .map((c: Check) => c.status)
          .slice(-29);
        setChecks([...recentStatuses]);
      } catch (err) {
        console.error("Error fetching recent ticks:", err);
      }
    })();
  }, [project.id]);

  // WebSocket for live updates
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    console.log("wss", WS_URL);
    ws.onopen = () => console.log("✅ WebSocket connected");
    ws.onclose = () => console.log("❌ WebSocket closed");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    ws.onmessage = (event) => {
      const update: WsUpdate = JSON.parse(event.data);
      if (update.projectId !== project.id) return;

      setStatus(update.status);
      setLastChecked(new Date().toISOString());

      setChecks((prev) => {
        const next = [...prev, "unknown"].slice(-MAX_TICKS - 1); // keep last tick unknown
        next[next.length - 1] = update.status; // update last tick with current status
        return next;
      });
    };

    return () => ws.close();
  }, [project.id]);

  const ticks = Array.from({ length: MAX_TICKS }).map(
    (_, i) => checks[i] ?? "unknown",
  );

  return (
    <div className="bg-[#222531] shadow-md rounded-lg p-6 max-w-5xl items-start">
      <div className="h-8 w-18 bg-[#1E274F] rounded-lg flex justify-center items-center mb-2 px-2 border border-radius-300 border-[#1E274F]">
        <h2 className="text-lg text-[#FFFFFF] font-semibold text-center text-shadow-lg">
          {project.name}
        </h2>
      </div>
      <p className="text-gray-400 mb-4 text-lg">URL: {project.url}</p>

      {/* Ticks */}
      <div className="flex flex-wrap gap-1 mb-2">
        {ticks.map((tick, idx) => (
          <div
            key={idx}
            className={`w-7 h-2 rounded-sm border ${
              tick === "up"
                ? "bg-green-500 border-green-600"
                : tick === "down"
                  ? "bg-red-500 border-red-600"
                  : "bg-gray-300 border-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Current status */}
      <p className="text-gray-500 text-sm">
        Current status:{" "}
        <span
          className={`font-semibold ${
            status === "up"
              ? "text-green-600"
              : status === "down"
                ? "text-red-600"
                : "text-gray-500"
          }`}
        >
          {status}
        </span>
      </p>

      {/* Last checked */}
      {lastChecked && (
        <p className="text-gray-400 text-xs mt-1">
          Last checked: {new Date(lastChecked).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default UptimeCard;
