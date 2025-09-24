"use client"
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
  const params = useParams<{id: string}>();
  
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

  useEffect(() => {
    if (!id) return;
    
        (async () => {
          try {
            const res = await fetch(`/api/project/${id}`);
            if (!res.ok) throw new Error("Failed to fetch project");

            const data = await res.json();
            console.log(data, "fetched project");
            const projectData: Project = {
              id: data.project.id,
              name: data.project.name,
              url: data.project.url ?? data.project.domain ?? "",
              domain: data.project.domain ?? undefined,
              status: data.project.status ?? "unknown",
              lastChecked: data.project.lastChecked ?? null,
              checks: [],
              analytics: data.project.analytics // start empty, ticks handled in card
            };
    
            setProject(projectData);
            console.log(projectData.analytics,"msdhoni")
          } catch (err) {
            console.error("Error fetching project:", err);
          }
        })();
  }, [id])

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

  return(
    <>
      <Header title="Your Projects" project={project?.name} />
      <div className="p-5 lg:px-32 lg:py-10">
        <ProjectProvider>
        <ProjectData
          website={id}
          websiteData={{
            name: project?.name,
            description: "description",
          }}
        />
         <AnimatedTabs tabs={tabs}></AnimatedTabs>
         <div className="flex flex-col gap-4 py-4">
          {activeTab === "analytics" && <Analytics analytics={project.analytics} />}
          {activeTab === "uptime" && <UptimeCard project={project} />}
          </div>
      </ProjectProvider>
      </div>
    </>
  );
};
