import { assertAuthenticated } from "@/lib/session";
import { EmptyProject } from "./_components/empty-project";
import { Header } from "./_components/header";
import { CreateModal } from "./_components/modal/create";
import { DeleteModal } from "./_components/modal/delete";
import { EditModal } from "./_components/modal/edit";
import { ProjectCard } from "./_components/project-card";
import { getAllProjects } from "@/use-cases/project";
import { Suspense } from "react";
import { ProjectSkelteon } from "./_components/project-skeleton";

const ProjectsPage = async () => {
  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      <Suspense fallback={<ProjectSkelteon />}>
        <Projects />
      </Suspense>
      <CreateModal />
      <EditModal />
      <DeleteModal />
    </div>
  );
};

const Projects = async () => {
  const session = await assertAuthenticated();
  const projects = await getAllProjects(session.id);
  return projects && Array.isArray(projects) && projects.length > 0 ? (
    <div className="p-3 w-full h-full">
      <div className="gap-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full">
        {projects.map((data, index) => (
          <ProjectCard key={index} data={data} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-1 justify-center items-center w-full h-full">
      <EmptyProject />
    </div>
  );
};

export default ProjectsPage;