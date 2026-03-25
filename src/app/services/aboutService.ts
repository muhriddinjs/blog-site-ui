import api from "../api/api";

export interface StatItem {
  value: string;
  label: string;
}

export interface AboutData {
  id?: number;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  stats: StatItem[];
  skills?: any[]; 
}

export const aboutService = {
  get: async () => {
    const { data } = await api.get<AboutData>("/about");
    return data;
  },
  adminGet: async () => {
    const { data } = await api.get<AboutData>("/admin/about");
    return data;
  },
  update: async (aboutData: AboutData) => {
    const { data } = await api.put<AboutData>("/admin/about", aboutData);
    return data;
  },
};
