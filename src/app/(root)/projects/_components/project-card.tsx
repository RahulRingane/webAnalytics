"use client";
import { motion, easeInOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useModal } from "@/store/store";
import { FilePenLine, SquareArrowOutUpRight, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/globals/heading";
import { CardSpotlight } from "@/components/ui/card-spotlight";
// Define the Project type if not already imported
/*
type Project = {
  name?: string;
  domain?: string;
  description?: string;
  // Add other fields as needed
};

export const ProjectCard = ({ data }: { data: Project }) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const encodedDomain = encodeURIComponent(data?.domain ?? "unknown");
  const projectLink = `/projects/${encodedDomain}`;

  return (
   
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.1,
        ease: easeInOut,
      }}
      key={data.name}
      className="group relative mb-4 h-33 scale-100 hover:scale-102  transition-transform transition duration-200">
      <div className="flex items-start gap-2 bg-[#323232] p-3 border border-[#27282D] rounded-md w-full h-full cursor-pointer">
        <div className="flex flex-col flex-1 gap-2 pr-2 h-full overflow-hidden">
          <div
            className="flex flex-col"
            role="button"
            onClick={() => router.push(projectLink)}
          >
            <div className="flex items-center gap-2">
                <h2 className="overflow-hidden text-white text-sm text-ellipsis text-nowrap">
                  {data?.name ?? "Untitled Project"}
                </h2>

              <div className="bg-green-400 p-[2px] rounded-full animate-pulse">
                <div className="bg-green-500 rounded-full size-[5px]" />
              </div>
            </div>
            <Link
              href={projectLink}
              className="flex items-center gap-1 text-[#62bdcf] text-[11px] 2xl:text-xs underline"
            >
              {data?.domain ?? "unknown"}
              <SquareArrowOutUpRight size={9} />
            </Link>
          </div>
          {data?.description ? (
            <p className="text-[#a0a0a4] text-xs 2xl:text-sm text-pretty">
              {data?.description?.length > 60
                ? `${data?.description.slice(0, 60)}...`
                : data?.description}
            </p>
          ) : (
            <p className="text-[#a0a0a4] text-xs 2xl:text-sm text-pretty">
              No description provided
            </p>
          )}
        </div>
        <div className="flex flex-col justify-between gap-2 pl-3 border-[#27282D] border-l h-full">
          <Button
            onClick={() => onOpen("editProject", data)}
            className="bg-transparent hover:bg-transparent p-0 rounded-full text-[#589eaafb]"
          >
            <FilePenLine size={16} />
          </Button>
          <Button
            onClick={() => onOpen("deleteProject", data)}
            className="bg-transparent hover:bg-transparent p-0 rounded-full text-[#f97171]"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
   
  );
};*/

type Project = {
  id: string; // ✅ add id field
  name?: string;
  domain?: string;
  description?: string;
};

export const ProjectCard = ({ data }: { data: Project }) => {
  const { onOpen } = useModal();
  const router = useRouter();

  // ✅ Use id instead of domain
  const projectLink = `/projects/${data.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.3, delay: 0.1, ease: easeInOut }}
      key={data.id}
      className="group relative mb-4 h-33 scale-100 hover:scale-102 transition-transform duration-200"
    >
      <div className="flex items-start gap-2 bg-[#222531] p-3 border border-[#222531] rounded-md w-full h-full cursor-pointer">
        <div className="flex flex-col flex-1 gap-2 pr-2 h-full overflow-hidden">
          <div
            className="flex flex-col"
            role="button"
            onClick={() => router.push(projectLink)}
          >
            <div className="flex items-center gap-2">
              <h2 className="overflow-hidden text-white text-sm text-ellipsis text-nowrap">
                {data?.name ?? "Untitled Project"}
              </h2>

              <div className="bg-green-400 p-[2px] rounded-full animate-pulse">
                <div className="bg-green-500 rounded-full size-[5px]" />
              </div>
            </div>
            <Link
              href={projectLink}
              className="flex items-center gap-1 text-[#62bdcf] text-[11px] 2xl:text-xs underline"
            >
              {data?.domain ?? "unknown"}
              <SquareArrowOutUpRight size={9} />
            </Link>
          </div>

          {data?.description ? (
            <p className="text-[#a0a0a4] text-xs 2xl:text-sm text-pretty">
              {data?.description?.length > 60
                ? `${data?.description.slice(0, 60)}...`
                : data?.description}
            </p>
          ) : (
            <p className="text-[#a0a0a4] text-xs 2xl:text-sm text-pretty">
              No description provided
            </p>
          )}
        </div>

        <div className="flex flex-col justify-between gap-2 pl-3 border-[#27282D] border-l h-full">
          <Button
            onClick={() => onOpen("editProject", data)}
            className="bg-transparent hover:bg-transparent p-0 rounded-full text-[#589eaafb]"
          >
            <FilePenLine size={16} />
          </Button>
          <Button
            onClick={() => onOpen("deleteProject", data)}
            className="bg-transparent hover:bg-transparent p-0 rounded-full text-[#f97171]"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

