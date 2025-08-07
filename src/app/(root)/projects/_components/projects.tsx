import { assertAuthenticated } from "@/lib/session";
import { getAllProjects } from "@/use-cases/project";
import { EmptyProject } from "./empty-project";
import { ProjectCard } from "./project-card";


export default async function Projects() {
  const session = await assertAuthenticated();
  const projects = await getAllProjects(session.id);

  if (!projects || !Array.isArray(projects) || projects.length === 0) {
    return (
      <div className="flex flex-1 justify-center items-center w-full h-full">
        <EmptyProject />
      </div>
    );
  }

  return (
    <div className="p-3 w-full h-full">
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
        {projects.map((data, index) => (
          <ProjectCard key={index} data={data} />
        ))}
      </div>
    </div>
  );
}