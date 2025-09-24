"use client";

import React, { useEffect, useState } from "react";
import type { Project, WsUpdate } from "@/types";
import { Check } from "@prisma/client";

interface UptimeCardProps {
  project: Project;
}

const MAX_TICKS = 30;
const WS_URL =  "ws://localhost:8080/ws";
//process.env.NEXT_PUBLIC_WS_URL ||

const UptimeCard: React.FC<UptimeCardProps> = ({ project }) => {
  const [status, setStatus] = useState(project.status);
  const [checks, setChecks] = useState<string[]>(
    Array(MAX_TICKS - 1).fill("unknown"),
  );
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
    ws.onopen = () => console.log(" WebSocket connected");
    ws.onclose = () => console.log(" WebSocket closed");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    ws.onmessage = (event) => {
      const update: WsUpdate = JSON.parse(event.data);
      if (update.projectId !== project.id) return;

      setStatus(update.status);
      setLastChecked(new Date().toISOString());

      setChecks((prev) => {
        const next = [...prev, "unknown"].slice(-MAX_TICKS - 1);
        next[next.length - 1] = update.status;
        return next;
      });
    };

    return () => ws.close();
  }, [project.id]);

  const ticks = Array.from({ length: MAX_TICKS }).map(
    (_, i) => checks[i] ?? "unknown",
  );

  // Derived metrics
  const totalChecks = ticks.filter((t) => t !== "unknown").length;
  const uptimeCount = ticks.filter((t) => t === "up").length;
  const downtimeCount = ticks.filter((t) => t === "down").length;
  const uptimePercentage =
    totalChecks > 0 ? ((uptimeCount / totalChecks) * 100).toFixed(2) : "N/A";

  return (
    <div
      className="group relative 
                 bg-gradient-to-br from-gray-900/80 to-gray-950/90 
                 backdrop-blur-sm rounded-2xl p-8 
                 border border-gray-800/50 max-w-5xl
                 hover:border-gray-700 hover:shadow-2xl hover:shadow-black/50
                 transition-all duration-300 ease-out 
                 hover:scale-[1.02] hover:-translate-y-1"
    >
      {/* Project Title */}
      <div className="h-8 w-fit bg-gray-800/70 rounded-lg flex justify-center items-center mb-4 px-3 border border-gray-700/50">
        <h2 className="text-lg text-white font-semibold text-center">
          {project.name}
        </h2>
      </div>

      <p className="text-gray-400 mb-6 text-sm">URL: {project.url}</p>

      {/* Ticks */}
      <div className="flex flex-wrap gap-1 mb-4">
        {ticks.map((tick, idx) => (
          <div
            key={idx}
            className={`w-7 h-2 rounded-sm border ${
              tick === "up"
                ? "bg-green-500 border-green-600"
                : tick === "down"
                ? "bg-red-500 border-red-600"
                : "bg-gray-500/40 border-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800/50 border border-gray-700/40 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-400">Uptime %</p>
          <p className="text-lg font-bold text-green-400">{uptimePercentage}%</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/40 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-400">Incidents</p>
          <p className="text-lg font-bold text-red-400">{downtimeCount}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/40 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-400">Checks</p>
          <p className="text-lg font-bold text-blue-400">{totalChecks}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/40 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-400">Last Status</p>
          <p
            className={`text-lg font-bold ${
              status === "up"
                ? "text-green-400"
                : status === "down"
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {status}
          </p>
        </div>
      </div>

      {/* Last checked */}
      {lastChecked && (
        <p className="text-gray-500 text-xs mt-2">
          Last checked: {new Date(lastChecked).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default UptimeCard;
