import api from "../api/api";

// ─── INTERFACELAR ─────────────────────────────────────────────────────────────

// Backend ArticleResponse sxemasiga to'liq mos keladi
export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: "design" | "performance" | "backend" | "frontend" | "devops" | "mobile" | "other";
  image?: string | null;
  // Backend: status = ArticleStatus enum (draft | published)
  status: "draft" | "published";
  // Backend: read_time = int (5, 10, ...) — string EMAS!
  read_time: number;
  // Backend: keywords = Optional[str] — comma-separated string, masalan "react, ts"
  // Lekin Frontend da array sifatida ishlatiladi, shuning uchun transformatsiya qilamiz
  keywords?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  views: number;
  published_at: string;  // ISO datetime string
  created_at: string;
  updated_at: string;
}

// Frontend da qulay ishlatish uchun keywords array sifatida
export interface ArticleUI extends Omit<Article, "keywords"> {
  keywords: string[];  // UI da array ko'rinishida
}

// Create/Update uchun payload — Backend ArticleCreate sxemasiga mos
export interface ArticleCreate {
  title: string;
  slug?: string;           // Ixtiyoriy: backend avtomatik generate qiladi
  summary: string;
  content: string;
  category?: string;
  image?: string | null;
  status?: "draft" | "published";
  read_time?: number;      // int — backend kutadi
  seo_title?: string | null;
  seo_description?: string | null;
  keywords?: string | null; // Backend: comma-separated string
}

export interface PaginatedArticles {
  items: Article[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ─── YORDAMCHI FUNKSIYALAR ────────────────────────────────────────────────────

/**
 * Backend dan kelgan Article ni Frontend UI uchun o'zgartiradi.
 * keywords: "react, typescript" → ["react", "typescript"]
 */
const toArticleUI = (article: Article): ArticleUI => ({
  ...article,
  keywords:
    typeof article.keywords === "string"
      ? article.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [],
});

/**
 * Frontend formidan kelgan ma'lumotni Backend ga yuborish uchun tayyorlaydi.
 * @param data - form dan kelgan ma'lumot (keywords array, read_time string bo'lishi mumkin)
 */
const toApiPayload = (
  data: Partial<ArticleUI & { read_time: string | number }>
): Omit<ArticleCreate, "title"> & { title?: string } => {
  const base = {
    ...data,
    // read_time: "5 daqiqa" yoki "5" → 5 (int)
    // Backend: read_time: int, ge=1, le=120
    read_time:
      typeof data.read_time === "string"
        ? Math.max(1, parseInt(data.read_time, 10) || 5)
        : (data.read_time ?? 5),

    // keywords: ["react", "typescript"] → "react, typescript"
    // Backend: keywords: Optional[str]
    keywords: Array.isArray(data.keywords)
      ? data.keywords.join(", ") || null
      : data.keywords ?? null,

    // category ni lowercase ga o'tkazish
    category: data.category?.toLowerCase() as ArticleCreate["category"],
  };

  // published_at, created_at, updated_at, id, views — backend sxemasida YO'Q
  const { published_at, created_at, updated_at, id, views, ...cleanPayload } = base as any;
  void published_at; void created_at; void updated_at; void id; void views;

  return cleanPayload;
};

// ─── SERVICE ──────────────────────────────────────────────────────────────────

export const articleService = {
  /**
   * Nashr qilingan maqolalar ro'yxatini olish (public)
   * Backend: GET /articles?page=1&size=10
   */
  getAll: async (params?: Record<string, any>): Promise<ArticleUI[]> => {
    try {
      // Muhim: trailing slash YO'Q — /articles/ → /articles
      const { data } = await api.get<PaginatedArticles>("/articles", { params });
      return data.items.map(toArticleUI);
    } catch (error: any) {
      console.error("[articleService.getAll] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Admin uchun barcha maqolalar (draft ham)
   * Backend: GET /admin/articles
   */
  adminGetAll: async (params?: Record<string, any>): Promise<ArticleUI[]> => {
    try {
      const { data } = await api.get<PaginatedArticles>("/admin/articles", { params });
      return data.items.map(toArticleUI);
    } catch (error: any) {
      console.error("[articleService.adminGetAll] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Slug bo'yicha maqolani olish (public, view count oshadi)
   * Backend: GET /articles/{slug}
   */
  getBySlug: async (slug: string): Promise<ArticleUI> => {
    try {
      const { data } = await api.get<Article>(`/articles/${slug}`);
      return toArticleUI(data);
    } catch (error: any) {
      console.error("[articleService.getBySlug] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Admin: ID bo'yicha maqolani olish (draft ham)
   * Backend: GET /admin/articles/{article_id}
   */
  adminGetById: async (id: number): Promise<ArticleUI> => {
    try {
      const { data } = await api.get<Article>(`/admin/articles/${id}`);
      return toArticleUI(data);
    } catch (error: any) {
      console.error("[articleService.adminGetById] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Yangi maqola yaratish
   * Backend: POST /admin/articles — JSON body, ArticleCreate sxemasi
   */
  create: async (article: Partial<ArticleUI & { read_time: string | number }>): Promise<ArticleUI> => {
    try {
      const payload = toApiPayload(article);
      const { data } = await api.post<Article>("/admin/articles", payload);
      return toArticleUI(data);
    } catch (error: any) {
      console.error("[articleService.create] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Maqolani yangilash
   * Backend: PUT /admin/articles/{article_id} — JSON body, ArticleUpdate sxemasi
   */
  update: async (
    id: number,
    article: Partial<ArticleUI & { read_time: string | number }>
  ): Promise<ArticleUI> => {
    try {
      const payload = toApiPayload(article);
      const { data } = await api.put<Article>(`/admin/articles/${id}`, payload);
      return toArticleUI(data);
    } catch (error: any) {
      console.error("[articleService.update] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Maqolani o'chirish
   * Backend: DELETE /admin/articles/{article_id} — 204 No Content qaytaradi
   */
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/admin/articles/${id}`);
    } catch (error: any) {
      console.error("[articleService.delete] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Maqola uchun rasm yuklash
   * Backend: POST /admin/articles/{article_id}/upload-image — multipart/form-data
   * MUHIM: Avval maqolani yaratib, ID olish kerak!
   * @returns { image_url: string } — backend qaytargan URL
   */
  uploadImage: async (articleId: number, file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file); // 'file' — backend UploadFile = File(...) parametri nomi

      const { data } = await api.post<{ image_url: string }>(
        `/admin/articles/${articleId}/upload-image`,
        formData,
        {
          headers: {
            // axios multipart uchun Content-Type ni avtomatik belgilaydi (boundary bilan)
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Backend: { "image_url": "/uploads/articles/abc123.jpg" }
      return data.image_url;
    } catch (error: any) {
      console.error("[articleService.uploadImage] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },
};
