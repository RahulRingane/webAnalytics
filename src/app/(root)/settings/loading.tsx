"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function IncidentsSkeleton  () {
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
          {[1, 2].map((i) => (
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
};
