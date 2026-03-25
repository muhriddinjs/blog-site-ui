import api from "../api/api";

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issued_date: string;
  certificate_type: "certificate" | "honor" | "achievement";
  skills: string[];
  image?: string;
  credential_url?: string;
}

export interface CertificateCreate {
  name: string;
  issuer: string;
  issued_date?: string;
  certificate_type?: string;
  skills?: string[];
  image?: string;
  credential_url?: string;
}

export const certificateService = {
  getAll: async () => {
    const { data } = await api.get<{ items: Certificate[] }>("/certificates");
    return data.items;
  },

  adminGetAll: async () => {
    const { data } = await api.get<{ items: Certificate[] }>("/admin/certificates");
    return data.items;
  },

  create: async (certificate: CertificateCreate) => {
    const { data } = await api.post<Certificate>("/admin/certificates", certificate);
    return data;
  },

  update: async (id: number, certificate: Partial<CertificateCreate>) => {
    const { data } = await api.put<Certificate>(`/admin/certificates/${id}`, certificate);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/admin/certificates/${id}`);
    return data;
  },
};
