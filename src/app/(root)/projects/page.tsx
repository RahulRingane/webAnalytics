import { assertAuthenticated } from "@/lib/session";
import { getAllProjects } from "@/use-cases/project";
import { Suspense } from "react";
import { EmptyProject } from "./_components/empty-project";
import { Header } from "./_components/header";
import { CreateModal } from "./_components/modal/create";
import { DeleteModal } from "./_components/modal/delete";
import { EditModal } from "./_components/modal/edit";
import { ProjectCard } from "./_components/project-card";
import { ProjectSkelteon } from "./_components/project-skeleton";
import { Heading } from "lucide-react";
import Projects from "./_components/projects";

export default async function ProjectsPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header title="Your Projects" />
      <Suspense fallback={<ProjectSkelteon />}>
        <Projects />
      </Suspense>
      <CreateModal />
      <EditModal />
      <DeleteModal />
    </div>
  );
}
