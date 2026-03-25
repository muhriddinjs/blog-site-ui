import api from "../api/api";

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  image?: string;
  status: "draft" | "published";
  published_at: string;
  read_time?: string;
  seo_title?: string;
  seo_description?: string;
  keywords?: string[];
}

export interface ArticleCreate {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  image?: string;
  status?: string;
  read_time?: string;
  seo_title?: string;
  seo_description?: string;
  keywords?: string[];
}
export interface PaginatedArticles {
  items: Article[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const transformArticle = (article: any): Article => ({
  ...article,
  keywords: typeof article.keywords === 'string' ? article.keywords.split(",").map((k: string) => k.trim()).filter(Boolean) : article.keywords || [],
});

export const articleService = {
  getAll: async (params?: any) => {
    const { data } = await api.get<PaginatedArticles>("/articles/", { params });
    return data.items.map(transformArticle);
  },

  adminGetAll: async (params?: any) => {
    const { data } = await api.get<PaginatedArticles>("/admin/articles", { params });
    return data.items.map(transformArticle);
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get<Article>(`/articles/${slug}`);
    return transformArticle(data);
  },

  create: async (article: ArticleCreate) => {
    const formattedArticle = {
      ...article,
      read_time: typeof article.read_time === 'string' ? parseInt(article.read_time) || 5 : article.read_time,
      keywords: Array.isArray(article.keywords) ? article.keywords.join(", ") : article.keywords,
      category: article.category?.toLowerCase(),
    };
    const { data } = await api.post<Article>("/admin/articles", formattedArticle);
    return data;
  },

  update: async (id: number, article: Partial<ArticleCreate>) => {
    const formattedArticle = {
      ...article,
      read_time: typeof article.read_time === 'string' ? parseInt(article.read_time) || 5 : article.read_time,
      keywords: Array.isArray(article.keywords) ? article.keywords.join(", ") : article.keywords,
      category: article.category?.toLowerCase(),
    };
    const { data } = await api.put<Article>(`/admin/articles/${id}`, formattedArticle);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/admin/articles/${id}`);
    return data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/articles/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};
