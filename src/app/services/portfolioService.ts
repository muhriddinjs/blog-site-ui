import api from "../api/api";

// ─── INTERFACELAR ─────────────────────────────────────────────────────────────

// Backend PortfolioResponse sxemasiga to'liq mos keladi
export interface Project {
  id: number;
  name: string;
  // Backend PortfolioCategory enum: web | mobile | design | backend | fullstack | other
  category: "web" | "mobile" | "design" | "backend" | "fullstack" | "other";
  description?: string | null;
  technologies: string[]; // Backend: List[str] = []
  tags: string[];         // Backend: List[str] = [] — formada ham kerak!
  live_url?: string | null;
  github_url?: string | null;
  image?: string | null;
  is_featured: boolean;   // Backend: bool = False
  order: number;          // Backend: int = 0
  created_at: string;
  updated_at: string;
}

// Yangi portfolio yaratish uchun payload — Backend PortfolioCreate sxemasiga mos
export interface ProjectCreate {
  name: string;                 // required, min_length=2, max_length=255
  category?: "web" | "mobile" | "design" | "backend" | "fullstack" | "other";
  description?: string | null;
  technologies?: string[];      // List[str], default []
  tags?: string[];              // List[str], default [] — yubormasak [] bo'ladi
  live_url?: string | null;
  github_url?: string | null;
  image?: string | null;
  is_featured?: boolean;        // default False
  order?: number;               // default 0
}

export interface PaginatedProjects {
  items: Project[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ─── YORDAMCHI FUNKSIYA ───────────────────────────────────────────────────────

/**
 * Form ma'lumotini Backend payload ga aylantiradi.
 * Bo'sh string URL larni null ga o'zgartiradi (backend Optional[str] kutadi)
 */
const toApiPayload = (data: Partial<ProjectCreate>): ProjectCreate => ({
  name: data.name!,
  category: data.category,
  description: data.description || null,
  technologies: data.technologies ?? [],
  tags: data.tags ?? [],           // Muhim: tags ni ham yuborish kerak
  // Bo'sh string URL lar backend da HttpUrl validatsiyasidan o'tmaydi
  live_url: data.live_url?.trim() || null,
  github_url: data.github_url?.trim() || null,
  image: data.image?.trim() || null,
  is_featured: data.is_featured ?? false,
  order: data.order ?? 0,
});

// ─── SERVICE ──────────────────────────────────────────────────────────────────

export const portfolioService = {
  /**
   * Barcha portfolio loyihalarini olish (public)
   * Backend: GET /portfolios?page=1&size=10&category=web&featured=true
   */
  getAll: async (params?: Record<string, any>): Promise<Project[]> => {
    try {
      const { data } = await api.get<PaginatedProjects>("/portfolios", { params });
      return data.items;
    } catch (error: any) {
      console.error("[portfolioService.getAll] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Admin uchun barcha loyihalar
   * Backend: GET /admin/portfolios
   */
  adminGetAll: async (params?: Record<string, any>): Promise<Project[]> => {
    try {
      const { data } = await api.get<PaginatedProjects>("/admin/portfolios", { params });
      return data.items;
    } catch (error: any) {
      console.error("[portfolioService.adminGetAll] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Yangi portfolio loyihasi yaratish
   * Backend: POST /admin/portfolios — JSON body, PortfolioCreate sxemasi
   */
  create: async (project: Partial<ProjectCreate>): Promise<Project> => {
    try {
      const payload = toApiPayload(project);
      const { data } = await api.post<Project>("/admin/portfolios", payload);
      return data;
    } catch (error: any) {
      console.error("[portfolioService.create] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Portfolio loyihasini yangilash
   * Backend: PUT /admin/portfolios/{portfolio_id} — JSON body, PortfolioUpdate sxemasi
   */
  update: async (id: number, project: Partial<ProjectCreate>): Promise<Project> => {
    try {
      const payload = toApiPayload(project);
      const { data } = await api.put<Project>(`/admin/portfolios/${id}`, payload);
      return data;
    } catch (error: any) {
      console.error("[portfolioService.update] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Portfolio loyihasini o'chirish
   * Backend: DELETE /admin/portfolios/{portfolio_id} — 204 No Content
   */
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/admin/portfolios/${id}`);
    } catch (error: any) {
      console.error("[portfolioService.delete] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },
};
