"use client";
import { motion, easeInOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useModal } from "@/store/store";
import {
  FilePenLine,
  Trash,
  Globe,
  ArrowUpRightSquare as SquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Projects = {
  id: string;
  name?: string;
  domain?: string;
  description?: string;
};

export const ProjectCard = ({ data }: { data: Projects }) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const projectLink = `/projects/${data.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: easeInOut }}
      key={data.id}
      className="group relative mb-4 w-full"
    >
      {/* Glow hover background */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>

      <div
        className="relative flex items-start gap-3 p-4 bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-800/80
                   border border-gray-700/50 rounded-xl w-full h-full cursor-pointer
                   hover:border-gray-600/60 hover:shadow-lg hover:shadow-purple-500/20
                   transition-all duration-300 ease-out"
        role="button"
        onClick={() => router.push(projectLink)}
      >
        {/* Left side content */}
        <div className="flex flex-col flex-1 gap-2 overflow-hidden">
          <div className="flex items-center gap-2">
            <h2 className="overflow-hidden text-white text-sm 2xl:text-base font-semibold text-ellipsis whitespace-nowrap group-hover:text-purple-300 transition-colors">
              {data?.name ?? "Untitled Project"}
            </h2>
            {/* Live indicator */}
            <div className="bg-emerald-400 p-[2px] rounded-full animate-pulse">
              <div className="bg-emerald-500 rounded-full size-[6px]" />
            </div>
          </div>

          {/* Domain */}
          <Link
            href={projectLink}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-[11px] 2xl:text-xs underline transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe className="w-3 h-3" />
            {data?.domain ?? "unknown"}
            <SquareArrowOutUpRight size={9} className="opacity-70" />
          </Link>

          {/* Description */}
          {data?.description ? (
            <p className="text-gray-300 text-xs 2xl:text-sm leading-relaxed text-pretty">
              {data.description.length > 60
                ? `${data.description.slice(0, 60)}...`
                : data.description}
            </p>
          ) : (
            <p className="text-gray-500 text-xs 2xl:text-sm italic">
              No description provided
            </p>
          )}
        </div>

        {/* Right side action buttons */}
        <div className="flex flex-col justify-between gap-2 pl-3 border-l border-gray-700/50">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onOpen("editProject", data);
            }}
            className="bg-transparent hover:bg-transparent p-0 rounded-full text-blue-400 hover:text-blue-300 transition-colors"
          >
            <FilePenLine size={16} />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onOpen("deleteProject", data);
            }}
            className="bg-transparent hover:bg-transparent p-0 rounded-full text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
