import { useState } from "react";
import { Upload, X } from "lucide-react";
import api, { resolveImageUrl } from "../../api/api";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  // Rasm yuklash uchun entity ma'lumotlari
  // Agar berilmasa — faqat URL input ko'rinadi (yaratishdan oldin)
  uploadConfig?: {
    entityType: "articles" | "portfolios" | "certificates";
    entityId: number;
  };
}

/**
 * ImageUpload komponenti.
 *
 * Backend da fayl yuklash endpoint'lari ID talab qiladi:
 *   POST /admin/articles/{id}/upload-image
 *   POST /admin/portfolios/{id}/upload-image
 *   POST /admin/certificates/{id}/upload-image
 *
 * Shuning uchun:
 *   - Yangi element yaratishda: faqat URL kiritish mumkin (file upload yo'q)
 *   - Mavjud elementni tahrirlashda: ham URL, ham fayl yuklash mumkin
 */
export function ImageUpload({
  value,
  onChange,
  label = "Rasm",
  uploadConfig,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // uploadConfig yo'q bo'lsa (yangi element) — fayl yuklash imkonsiz
    if (!uploadConfig) {
      alert("Faylni yuklash uchun avval elementni saqlang, so'ng tahrirlash rejimida rasm yuklang.");
      e.target.value = "";
      return;
    }

    // Validatsiya: Fayl hajmi (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Fayl hajmi 5MB dan oshmasligi kerak.");
      e.target.value = "";
      return;
    }

    // Validatsiya: Fayl turi
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Faqat JPG, PNG, GIF yoki WEBP formatidagi rasmlar ruxsat etilgan.");
      e.target.value = "";
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      // 'file' — backend dagi UploadFile = File(...) parametri nomi
      formData.append("file", file);

      // Backend endpoint: /admin/{entityType}/{entityId}/upload-image
      // Axios'dan foydalaniladi — JWT token avtomatik qo'shiladi (api.ts interceptor)
      const { data } = await api.post<{ image_url: string }>(
        `/admin/${uploadConfig.entityType}/${uploadConfig.entityId}/upload-image`,
        formData,
        {
          headers: {
            // axios multipart/form-data ni avtomatik boundary bilan o'rnatadi
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Backend: { "image_url": "/uploads/articles/abc123.jpg" }
      // Bu relative URL — Backend base URL bilan birlashtiriladi
      onChange(data.image_url);
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.detail ||
        error?.message ||
        "Rasmni yuklash imkonsiz bo'ldi.";
      setUploadError(errMsg);
      console.error("[ImageUpload] Xatolik:", error?.response?.data || error.message);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      {/* Xatolik xabari */}
      {uploadError && (
        <div className="mb-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
          <span>{uploadError}</span>
          <button type="button" onClick={() => setUploadError(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Rasm preview */}
      {value ? (
        <div className="relative mb-2">
          <img
            src={resolveImageUrl(value)}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
            onError={(e) => {
              // Agar rasm yuklanmasa, placeholder ko'rsat
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ) : uploadConfig ? (
        /* Fayl yuklash zonasi — faqat mavjud entity uchun */
        <label
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-2"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-3"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Yuklanmoqda...</p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Bosing</span> yoki faylni tashlang
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  PNG, JPG yoki GIF (MAX. 5MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>
      ) : (
        /* Yangi element yaratishda — faqat URL */
        <div className="mb-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
          💡 Fayl yuklash uchun avval elementni saqlang, so'ng tahrirlashda rasm yuklang.
          Hozir quyidan URL kiritishingiz mumkin.
        </div>
      )}

      {/* URL input — har doim ko'rinadi */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Yoki rasm URL kiriting (https://...)"
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
      />
    </div>
  );
}
