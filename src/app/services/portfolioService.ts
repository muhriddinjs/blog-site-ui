import api from "../api/api";

export interface Project {
  id: number;
  name: string;
  category: "web" | "mobile" | "design" | "backend" | "fullstack";
  description: string;
  image?: string;
  technologies: string[];
  live_url?: string;
  github_url?: string;
  is_featured: boolean;
  order: number;
}

export interface ProjectCreate {
  name: string;
  category: string;
  description: string;
  image?: string;
  technologies?: string[];
  live_url?: string;
  github_url?: string;
  is_featured?: boolean;
  order?: number;
}

export const portfolioService = {
  getAll: async () => {
    const { data } = await api.get<{ items: Project[] }>("/portfolios/");
    return data.items;
  },

  create: async (project: ProjectCreate) => {
    const { data } = await api.post<Project>("/admin/portfolios", project);
    return data;
  },

  update: async (id: number, project: Partial<ProjectCreate>) => {
    const { data } = await api.put<Project>(`/admin/portfolios/${id}`, project);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/admin/portfolios/${id}`);
    return data;
  },
};
