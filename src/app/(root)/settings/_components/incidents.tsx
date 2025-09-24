"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { AnimatedTabs } from "./animated-tab";
import { useSettingsTabStore } from "@/store/store";
import { ProjectData } from "../../projects/_components/project-data";
import { ProjectProvider } from "@/contexts/project-context";
import { Project } from "@/types";

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
        const tabList = projects.map((p: Project) => ({ id: p.id, label: p.name }));

        for (const project of projects) {
          const resIncidents = await fetch(
            `/api/project/${project.id}/incidents`
          );
          const projectIncidents = await resIncidents.json();
          grouped[project.id] = projectIncidents;
          for (const incident of projectIncidents) {
            incident.id = project.name
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
    if (statusCode >= 200 && statusCode < 300)
      return "text-green-400";
    if (statusCode >= 300 && statusCode < 400)
      return "text-amber-400";
    return "text-red-400";
  };

  if (loading) return <div>Loading incidents...</div>;
  if (!activeTab || Object.keys(incidentsByProject).length === 0)
    return (
      <div className="flex flex-col items-center justify-start py-20 text-gray-400 text-lg">
        <CheckCircle className="w-14 h-14 text-green-400 mb-3" />
        No incidents found.
      </div>
    );

  return (
    <div className="flex justify-start">
      <div className="flex flex-col gap-5 p-5 w-[75%] text-lg">
         <AnimatedTabs tabs={tabs} />
        <div className="flex flex-col gap-1.5 font-mono bg-gray-900 rounded-md p-3">
          {!incidentsByProject[activeTab] ? (
            <div className="py-3 text-gray-400">No incidents for this project.</div>
          ) : (
            incidentsByProject[activeTab].map((incident, index) => {
              return (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-gray-300 font-bold text-lg">
                    <AlertTriangle className="w-5 h-5" />
                    <span>{incident.id}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm justify-between">
                    <h2 className="text-[#FFFFFF] text-center text-shadow-lg">
                      statuscode:
                      <span className={getStatusColor(incident.statusCode)}>
                        {` ${incident.statusCode}`}
                      </span>
                    </h2>
                    <h2 className="text-[#FFFFFF] text-center text-shadow-lg">
                      Bug status:
                      <span className={incident.resolved ? "text-green-400" : "text-red-400"}>
                        {` ${incident.resolved ? "Resolved" : "Active"}`}
                      </span>
                    </h2>
                    <h2 className="text-[#FFFFFF] text-center text-shadow-lg">
                      Reason:
                      <span className="text-gray-400">
                       {` ${incident.reason || "N/A"}`}
                      </span>
                    </h2>
                    <span className="text-blue-300">
                      {incident.duration
                        ? `${Math.floor(incident.duration / 60000)} mins`
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
