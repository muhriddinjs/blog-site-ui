import api from "../api/api";

// ─── INTERFACELAR ─────────────────────────────────────────────────────────────

// Backend CertificateResponse sxemasiga to'liq mos keladi
export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  // Backend CertificateType enum: certificate | honor | achievement
  // MUHIM: diploma, course, badge — backend da YO'Q!
  certificate_type: "certificate" | "honor" | "achievement";
  skills: string[];          // Backend: List[str] = []
  image?: string | null;
  credential_url?: string | null;
  issued_date?: string | null;   // ISO datetime string
  expiry_date?: string | null;   // ISO datetime string
  created_at: string;
  updated_at: string;
}

// Yangi sertifikat yaratish uchun payload — Backend CertificateCreate sxemasiga mos
export interface CertificateCreate {
  name: string;              // required, min_length=2, max_length=255
  issuer: string;            // required, min_length=2, max_length=255
  certificate_type?: "certificate" | "honor" | "achievement"; // default: certificate
  skills?: string[];         // List[str], default []
  image?: string | null;
  credential_url?: string | null;
  // Backend: Optional[datetime] — ISO format string yuborish kerak
  issued_date?: string | null;
  expiry_date?: string | null;
}

export interface PaginatedCertificates {
  items: Certificate[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ─── YORDAMCHI FUNKSIYA ───────────────────────────────────────────────────────

/**
 * Form ma'lumotini Backend payload ga aylantiradi.
 * Sana formatini tekshiradi va null ga o'zgartiradi.
 */
const toApiPayload = (data: Partial<CertificateCreate>): CertificateCreate => {
  // Sana: "2024-01-15" → "2024-01-15T00:00:00" yoki null
  const formatDate = (dateStr?: string | null): string | null => {
    if (!dateStr) return null;
    // Agar faqat "YYYY-MM-DD" bo'lsa, backend datetime format kutadi
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return `${dateStr}T00:00:00`;
    }
    return dateStr;
  };

  return {
    name: data.name!,
    issuer: data.issuer!,
    certificate_type: data.certificate_type ?? "certificate",
    skills: data.skills ?? [],
    image: data.image?.trim() || null,
    credential_url: data.credential_url?.trim() || null,
    issued_date: formatDate(data.issued_date),
    expiry_date: formatDate(data.expiry_date),
  };
};

// ─── SERVICE ──────────────────────────────────────────────────────────────────

export const certificateService = {
  /**
   * Barcha sertifikatlarni olish (public)
   * Backend: GET /certificates?page=1&size=10
   */
  getAll: async (params?: Record<string, any>): Promise<Certificate[]> => {
    try {
      const { data } = await api.get<PaginatedCertificates>("/certificates", { params });
      return data.items;
    } catch (error: any) {
      console.error("[certificateService.getAll] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Admin uchun barcha sertifikatlar
   * Backend: GET /admin/certificates
   */
  adminGetAll: async (params?: Record<string, any>): Promise<Certificate[]> => {
    try {
      const { data } = await api.get<PaginatedCertificates>("/admin/certificates", { params });
      return data.items;
    } catch (error: any) {
      console.error("[certificateService.adminGetAll] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Yangi sertifikat yaratish
   * Backend: POST /admin/certificates — JSON body, CertificateCreate sxemasi
   */
  create: async (certificate: Partial<CertificateCreate>): Promise<Certificate> => {
    try {
      const payload = toApiPayload(certificate);
      const { data } = await api.post<Certificate>("/admin/certificates", payload);
      return data;
    } catch (error: any) {
      console.error("[certificateService.create] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Sertifikatni yangilash
   * Backend: PUT /admin/certificates/{certificate_id} — JSON body, CertificateUpdate sxemasi
   */
  update: async (id: number, certificate: Partial<CertificateCreate>): Promise<Certificate> => {
    try {
      const payload = toApiPayload(certificate);
      const { data } = await api.put<Certificate>(`/admin/certificates/${id}`, payload);
      return data;
    } catch (error: any) {
      console.error("[certificateService.update] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Sertifikatni o'chirish
   * Backend: DELETE /admin/certificates/{certificate_id} — 204 No Content
   */
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/admin/certificates/${id}`);
    } catch (error: any) {
      console.error("[certificateService.delete] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Sertifikat uchun rasm yuklash
   * Backend: POST /admin/certificates/{certificate_id}/upload-image — multipart/form-data
   * MUHIM: Avval sertifikatni yaratib, ID olish kerak!
   * @returns { image_url: string } — /uploads/certificates/abc123.jpg
   */
  uploadImage: async (certificateId: number, file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file); // 'file' — backend UploadFile = File(...) parametri

      const { data } = await api.post<{ image_url: string }>(
        `/admin/certificates/${certificateId}/upload-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Backend: { "image_url": "/uploads/certificates/abc123.jpg" }
      return data.image_url;
    } catch (error: any) {
      console.error("[certificateService.uploadImage] Xatolik:", error?.response?.data || error.message);
      throw error;
    }
  },
};
