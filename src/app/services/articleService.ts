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

export const articleService = {
  getAll: async (params?: any) => {
    const { data } = await api.get<{ items: Article[] }>("/articles/", { params });
    return data.items;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get<Article>(`/articles/${slug}`);
    return data;
  },

  create: async (article: ArticleCreate) => {
    const { data } = await api.post<Article>("/articles/", article);
    return data;
  },

  update: async (id: number, article: Partial<ArticleCreate>) => {
    const { data } = await api.put<Article>(`/articles/${id}`, article);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/articles/${id}`);
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
