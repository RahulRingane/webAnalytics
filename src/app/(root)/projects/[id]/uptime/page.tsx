/* "use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import UptimeCard from "../../_components/uptime-card";
import type { Project } from "@/types";

export default function UptimeDashboardPage() {
  const params = useParams<{ id: string }>();
  const id = useMemo(() => {
    const w = params?.id;
    return Array.isArray(w) ? w[0] : w;
  }, [params]);

  const [project, setProject] = useState<Project | null>(null);

  // Initial fetch of project data
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`/api/project/${id}`);
        if (!res.ok) throw new Error("Failed to fetch project");
         
        const data = await res.json();
         console.log(data.id, "rees")
        const projectData: Project = {
          id: data.id,
          name: data.name,
          url: data.url ?? data.domain ?? "",
          domain: data.domain ?? undefined,
          status: data.status ?? "unknown",
          lastChecked: data.lastChecked ?? null,
          checks: [], // start empty, ticks handled in card
        };

        setProject(projectData);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    })();
  }, [website]);

  if (!project) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading uptime data for <b>{website}</b>...
      </p>
    );
  }

  return (
    <div className="p-4">
      <UptimeCard project={project} />
    </div>
  );
}*/

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import UptimeCard from "../../_components/uptime-card";
import type { Project } from "@/types";

export default function UptimeDashboardPage() {
  const params = useParams<{ id: string }>();

  // Extract `id` safely
  const id = useMemo(() => {
    const w = params?.id;
    return Array.isArray(w) ? w[0] : w;
  }, [params]);

  const [project, setProject] = useState<Project | null>(null);

  // Initial fetch of project data
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`/api/project/${id}`);
        if (!res.ok) throw new Error("Failed to fetch project");

        const data = await res.json();
        console.log(data.project.id, "fetched project");

        const projectData: Project = {
          id: data.project.id,
          name: data.project.name,
          url: data.project.url ?? data.project.domain ?? "",
          domain: data.project.domain ?? undefined,
          status: data.project.status ?? "unknown",
          lastChecked: data.project.lastChecked ?? null,
          checks: [], // start empty, ticks handled in card
        };

        setProject(projectData);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    })();
  }, [id]); // ✅ use id, not website

  if (!project) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading uptime data for <b>{id}</b>...
      </p>
    );
  }

  return (
    <div className="p-4 items-start">
      <UptimeCard project={project} />
    </div>
  );
}

