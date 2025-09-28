 "use client";

import React from "react";
import Link from "next/link";
import { useProject } from "@/contexts/project-context";
import { Package, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Project } from "@/types";

type Props = {
  project: Project;
};

export const ProjectData = ({ project }: Props) => {
  const { favIcon } = useProject();

  return (
    <header className="flex items-center gap-4 py-4">
      {/* Icon */}
      <div>
        {favIcon ? (
          <Image
            src={`https://${project.domain}/${favIcon}`}
            alt="Project favicon"
            width={40}
            height={40}
            className="rounded"
          />
        ) : (
          <Package size={40} className="text-gray-400" />
        )}
      </div>

      {/* Text content */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white">{project.name}</h1>

        <Link
          href={`https://${project.domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-400 hover:underline text-sm"
        >
          <span>{project.domain}</span>
          <ExternalLink size={14} />
        </Link>

        {project.description && (
          <p className="text-gray-400 text-sm mt-1">{project.description}</p>
        )}
      </div>
    </header>
  );
};
