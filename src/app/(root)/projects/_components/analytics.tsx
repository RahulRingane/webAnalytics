/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  NextJsScript,
  nextJsScript,
  reactJsScript,
  ReactJsScript,
} from "@/config/code";
import { useTabStore } from "@/store/store";
import { ArrowUp, CloudAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnalyticsGraph } from "./analytics-graph";
import { ScriptDisplay } from "./script";

export const Analytics = ({ analytics, performanceAnalytics }: { analytics: any, performanceAnalytics: any }) => {
  const { activeTab } = useTabStore();
  const [scriptHtml, setScriptHtml] = useState<string | null>(null);
  const [reactScriptHtml, setReactScriptHtml] = useState<string | null>(null);

  useEffect(() => {
    const fetchScripts = async () => {
      if (!analytics) {
        try {
          const nextHtml = await NextJsScript();
          const reactHtml = await ReactJsScript();

          setScriptHtml(nextHtml);
          setReactScriptHtml(reactHtml);
        } catch (error) {
          console.error("Failed to fetch script HTML:", error);
          toast.error("Unable to load tracking scripts");
        }
      }
    };

    fetchScripts();
  }, [analytics]);

  const copyToClipboard = async (script: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(script);
      toast.success(successMessage);
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleNextScriptCopy = () =>
    copyToClipboard(nextJsScript, "Next.js script copied");
  const handleReactScriptCopy = () =>
    copyToClipboard(reactJsScript, "React script copied");

  if (!analytics) {
    return (
      <div
        className={`flex-col border border-gray-700 rounded-lg shadow-sm bg-gray-900/80 p-6 gap-4 ${activeTab === "analytics" ? "flex" : "hidden"
          }`}
      >
        <div className="flex flex-col items-center gap-3 text-white">
          <CloudAlert size={36} className="text-gray-400" />
          <h2 className="font-semibold text-xl">No Analytics Data</h2>
          <p className="text-gray-400 text-center text-sm max-w-xs">
            Analytics tracking is not configured. Use the scripts below to
            start collecting insights.
          </p>

          {scriptHtml && (
            <ScriptDisplay html={scriptHtml} onCopy={handleNextScriptCopy} />
          )}
          {reactScriptHtml && (
            <ScriptDisplay html={reactScriptHtml} onCopy={handleReactScriptCopy} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-col border border-gray-700 rounded-lg shadow-sm bg-gray-900/80 ${activeTab === "analytics" ? "flex" : "hidden"
        }`}
    >
      {/* Top Stats: compact and minimal */}
      <div className="flex gap-4 p-4 border-b border-gray-700/50">
        <CompactStat label="Visitors" value={analytics?.totalVisitors ?? 0} />
        <CompactStat label="Page Views" value={analytics?.totalPageVisits ?? 0} />
      </div>

      {/* Analytics Graph */}
      <div className="p-4 border-b border-gray-700/50">
        <AnalyticsGraph visitHistory={analytics?.visitHistory || []} />
      </div>

      {/* Bottom Grid: Pages & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 border-b border-gray-700/50">
        <AnalyticsCard
          title="Pages"
          subtitle="Page Views"
          data={analytics?.routeAnalytics}
          dataKey="route"
          valueKey="pageVisits"
        />
        <AnalyticsCard
          title="Devices"
          subtitle="Visitors"
          data={analytics?.deviceAnalytics}
          dataKey="deviceType"
          valueKey="visitors"
        />
      </div>

      {/* Bottom Grid: Countries & OS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <AnalyticsCard
          title="Countries"
          subtitle="Visitors"
          data={analytics?.countryAnalytics}
          dataKey="countryName"
          valueKey="visitors"
        />
        <AnalyticsCard
          title="Operating System"
          subtitle="Page Views"
          data={analytics?.osAnalytics}
          dataKey="osName"
          valueKey="visitors"
        />
      </div>
      {/* Bottom Grid: Performance Metrics */}
      {performanceAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
          <AnalyticsCard
            title="DOM Ready"
            subtitle="ms"
            data={[{ metric: "DOM Ready", value: performanceAnalytics.dom_ready }]}
            dataKey="metric"
            valueKey="value"
          />
          <AnalyticsCard
            title="Load Time"
            subtitle="ms"
            data={[{ metric: "Load Time", value: performanceAnalytics.load_time }]}
            dataKey="metric"
            valueKey="value"
          />
          <AnalyticsCard
            title="Network Latency"
            subtitle="ms"
            data={[{ metric: "Network Latency", value: performanceAnalytics.network_latency }]}
            dataKey="metric"
            valueKey="value"
          />
          <AnalyticsCard
            title="Processing Time"
            subtitle="ms"
            data={[{ metric: "Processing Time", value: performanceAnalytics.processing_time }]}
            dataKey="metric"
            valueKey="value"
          />
        </div>
      )}
    </div>
  );
};

// Compact top stats component
const CompactStat = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-start">
    <span className="text-gray-400 text-sm uppercase">{label}</span>
    <span className="text-white font-semibold text-lg">{value}</span>
  </div>
);

// Reusable Analytics card
const AnalyticsCard = ({
  title,
  subtitle,
  data,
  dataKey,
  valueKey,
}: {
  title: string;
  subtitle: string;
  data: any[];
  dataKey: string;
  valueKey: string;
}) => {
  return (
    <div className="flex flex-col gap-2 bg-gray-800/40 rounded-md p-2 border border-gray-700/50">
      <div className="flex justify-between items-center border-b border-gray-700/50 pb-1 px-2">
        <span className="text-white font-medium">{title}</span>
        <span className="text-gray-400 text-xs uppercase">{subtitle}</span>
      </div>
      <div className="flex flex-col gap-1 pt-2">
        {Array.isArray(data) && data.length > 0 ? (
          data.slice(0, 4).map((item: any, i: number) => (
            <div
              key={i}
              className="flex justify-between items-center px-2 py-1 rounded hover:bg-gray-700/50 transition text-white text-sm"
            >
              <span>{item[dataKey]}</span>
              <span className="font-semibold">{item[valueKey]}</span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 h-20 text-gray-400 text-sm">
            <CloudAlert size={20} />
            No Data Found
          </div>
        )}
      </div>
    </div>
  );
};
