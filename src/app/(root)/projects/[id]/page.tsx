"use client";
import { ProjectProvider } from "@/contexts/project-context";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Analytics } from "../_components/analytics";
import { AnimatedTabs } from "../_components/animated-tab";
import { Header } from "../_components/header";
import { Metadata } from "../_components/metadata";
import { ProjectData } from "../_components/project-data";
import { useParams } from "next/navigation";
import { Project } from "@/types";
import UptimeCard from "../_components/uptime-card";
import { useTabStore } from "@/store/store";
import { MetadataSkeleton } from "../_components/metadata-skeleton";
import { ProjectDataSkeleton } from "../_components/projectData-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function WebsiteDetailPage() {
  const params = useParams<{ id: string }>();

  const id = useMemo(() => {
    const w = params?.id;
    return Array.isArray(w) ? w[0] : w;
  }, [params]);

  const tabs = [
    { id: "analytics", label: "Analytics" },
    { id: "uptime", label: "Uptime" },
  ];

  const { activeTab } = useTabStore();
  const [project, setProject] = useState<Project | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [processedPerformance, setProcessedPerformance] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`/api/project/${id}`);
        if (!res.ok) throw new Error("Failed to fetch project");

        const data = await res.json();

        const projectData: Project = {
          id: data.project.id,
          name: data.project.name,
          url: data.project.url ?? data.project.domain ?? "",
          domain: data.project.domain ?? undefined,
          description: data.project.description ?? "default",
          status: data.project.status ?? "unknown",
          lastChecked: data.project.lastChecked ?? null,
          checks: [],
          performanceAnalytics: data.project.performanceAnalytics,
          analytics: data.project.analytics,
        };

        setProject(projectData);

        // performance anlytics compute average for each metric
        const perfArray = data.project.performanceAnalytics;
        if (Array.isArray(perfArray) && perfArray.length > 0) {
          const total = perfArray.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (acc: any, curr: any) => {
              acc.dom_ready += curr.dom_ready;
              acc.load_time += curr.load_time;
              acc.network_latency += curr.network_latency;
              acc.processing_time += curr.processing_time;
              acc.total_time += curr.total_time;
              return acc;
            },
            {
              dom_ready: 0,
              load_time: 0,
              network_latency: 0,
              processing_time: 0,
              total_time: 0,
            }
          );

          const avg = {
            dom_ready: Math.round(total.dom_ready / perfArray.length),
            load_time: Math.round(total.load_time / perfArray.length),
            network_latency: Math.round(total.network_latency / perfArray.length),
            processing_time: Math.round(total.processing_time / perfArray.length),
            total_time: Math.round(total.total_time / perfArray.length),
          };

          setProcessedPerformance(avg);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    })();
  }, [id]);

  if (!project) {
    return (
      <div className="p-5 lg:px-32 lg:py-20">
        <ProjectDataSkeleton />
        <div className="mt-4">
          <AnimatedTabs tabs={tabs} />
        </div>
        <div className="flex flex-col gap-4 py-4">
          {activeTab === "metadata" && <MetadataSkeleton />}
          {activeTab === "analytics" && (
            <div className="p-4 border border-[#383b4183] rounded-lg">
              <Skeleton className="h-6 w-32 mb-2 bg-slate-500" />
              <Skeleton className="h-48 w-full bg-slate-500 rounded-lg" />
            </div>
          )}
          {activeTab === "uptime" && (
            <div className="p-4 border border-[#383b4183] rounded-lg">
              <Skeleton className="h-6 w-40 mb-2 bg-slate-500" />
              <Skeleton className="h-20 w-full bg-slate-500 rounded-lg" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Header title="Your Projects" project={project?.name} />
      <div className="p-5 lg:px-32 lg:py-10">
        <ProjectProvider>
          <ProjectData project={project} />
          <AnimatedTabs tabs={tabs} />
          <div className="flex flex-col gap-4 py-4">
            {activeTab === "analytics" && (
              <Analytics
                analytics={project.analytics}
                performanceAnalytics={processedPerformance}
              />
            )}
            {activeTab === "uptime" && <UptimeCard project={project} />}
          </div>
        </ProjectProvider>
      </div>
    </>
  );
}
