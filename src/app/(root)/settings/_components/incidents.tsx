"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { AnimatedTabs } from "./animated-tab";
import { useSettingsTabStore } from "@/store/store";
import { ProjectData } from "../../projects/_components/project-data";
import { ProjectProvider } from "@/contexts/project-context";
import { Project } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

type Incident = {
  id: string;
  projectId: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  reason: string | null;
  statusCode: number;
  resolved: boolean;
};

export const Incidents = ({ userId }: { userId: string }) => {
  const [incidentsByProject, setIncidentsByProject] = useState<
    Record<string, Incident[]>
  >({});
  const [tabs, setTabs] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeTab, setActiveTab } = useSettingsTabStore();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        if (!userId) return;

        const resProjects = await fetch(`/api/project/pid/${userId}`);
        const { projects } = await resProjects.json();

        const grouped: Record<string, Incident[]> = {};
        const tabList = projects.map((p: Project) => ({
          id: p.id,
          label: p.name,
        }));

        for (const project of projects) {
          const resIncidents = await fetch(
            `/api/project/${project.id}/incidents`,
          );
          const projectIncidents = await resIncidents.json();
          grouped[project.id] = projectIncidents;
          for (const incident of projectIncidents) {
            incident.id = project.name;
          }
        }

        setIncidentsByProject(grouped);
        setTabs(tabList);

        if (!activeTab && projects.length > 0) {
          setActiveTab(projects[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [userId, activeTab, setActiveTab]);

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return "text-green-400";
    if (statusCode >= 300 && statusCode < 400) return "text-amber-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col gap-4 p-4 w-full md:w-[75%] text-sm md:text-lg">
          {/* Tabs placeholder */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-md bg-slate-500" />
            <Skeleton className="h-8 w-24 rounded-md bg-slate-500" />
            <Skeleton className="h-8 w-16 rounded-md bg-slate-500" />
          </div>

          {/* Incident cards (repeat a few times) */}
          <div className="flex flex-col gap-4 font-mono bg-gray-900 rounded-md p-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                {/* Incident header */}
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded-full bg-slate-500" />
                  <Skeleton className="h-5 w-32 bg-slate-500 rounded" />
                </div>

                {/* Status row */}
                <div className="flex flex-wrap gap-3 justify-between">
                  <Skeleton className="h-5 w-28 bg-slate-500 rounded" />
                  <Skeleton className="h-5 w-28 bg-slate-500 rounded" />
                  <Skeleton className="h-5 w-32 bg-slate-500 rounded" />
                  <Skeleton className="h-5 w-24 bg-slate-500 rounded" />
                </div>

                {/* Timestamps */}
                <div className="flex justify-between text-xs">
                  <Skeleton className="h-4 w-40 bg-slate-500 rounded" />
                  <Skeleton className="h-4 w-32 bg-slate-500 rounded" />
                </div>

                {/* Divider */}
                {i === 1 && <hr className="border-gray-700 my-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (!activeTab || Object.keys(incidentsByProject).length === 0)
    return (
      <div className="flex flex-col items-center justify-start py-20 text-gray-400 text-lg">
        <CheckCircle className="w-14 h-14 text-green-400 mb-3" />
        No incidents found.
      </div>
    );

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 p-4 w-full md:w-[75%] text-sm md:text-lg">
        <AnimatedTabs tabs={tabs} />
        <div className="flex flex-col gap-2 font-mono bg-gray-900 rounded-md p-3">
          {!incidentsByProject[activeTab] ? (
            <div className="py-3 text-gray-400 text-center">
              No incidents for this project.
            </div>
          ) : (
            incidentsByProject[activeTab].map((incident, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-300 font-bold text-base md:text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{incident.id}</span>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3 text-sm md:text-base justify-between">
                  <h2 className="text-white text-center">
                    Status code:
                    <span className={getStatusColor(incident.statusCode)}>
                      {` ${incident.statusCode}`}
                    </span>
                  </h2>
                  <h2 className="text-white text-center">
                    Bug status:
                    <span
                      className={
                        incident.resolved ? "text-green-400" : "text-red-400"
                      }
                    >
                      {` ${incident.resolved ? "Resolved" : "Active"}`}
                    </span>
                  </h2>
                  <h2 className="text-white text-center">
                    Reason:
                    <span className="text-gray-400">{` ${incident.reason || "Bad Response"}`}</span>
                  </h2>
                  <h2 className="text-white text-center">
                    Duration:{" "}
                    <span className="text-blue-300">
                      {incident.duration
                        ? ` ${Math.floor(incident.duration / 60000)} mins`
                        : "Unknown"}
                    </span>
                  </h2>
                </div>

                <div className="flex flex-col md:flex-row justify-between text-gray-500 text-xs md:text-sm mt-1">
                  <span>
                    Started: {new Date(incident.startTime).toLocaleString()}
                  </span>
                  <span>
                    Ended:{" "}
                    {incident.endTime
                      ? new Date(incident.endTime).toLocaleString()
                      : "Ongoing"}
                  </span>
                </div>

                {index < incidentsByProject[activeTab].length - 1 && (
                  <hr className="border-gray-700 my-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
