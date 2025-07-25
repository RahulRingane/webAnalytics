import "server-only";

import { getDomainProject, getProjects } from "@/data-access/project";

export const getAllProjects = async (id: string | undefined) => {
  if (!id) {
    return null;
  }
  const res = await getProjects(id);
  return res || [];
};

export const getProjectByDomain = async (domain: string | null) => {
 if (!domain) {
   return null;
 }
 const res = await getDomainProject(domain);
 return res;
}