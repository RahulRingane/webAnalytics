import { Skeleton } from "@/components/ui/skeleton";

export const ProjectDataSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 border border-[#383b4183] rounded-lg p-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full bg-slate-500" />
        <Skeleton className="h-5 w-40 bg-slate-500" />
      </div>

      {/* Description */}
      <Skeleton className="h-4 w-3/4 bg-slate-500" />

      {/* Extra info grid */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <Skeleton className="h-10 w-full bg-slate-500 rounded-lg" />
        <Skeleton className="h-10 w-full bg-slate-500 rounded-lg" />
      </div>
    </div>
  );
};
