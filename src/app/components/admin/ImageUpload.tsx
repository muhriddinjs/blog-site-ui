import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Rasm",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validatsiya: Fayl hajmini tekshirish (5MB = 5 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert("Xatolik: Fayl hajmi 5MB dan oshmasligi kerak.");
      e.target.value = ""; // Inputni tozalash
      return;
    }

    // 2. Validatsiya: Fayl turini tekshirish
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert(
        "Xatolik: Faqat JPG, PNG, GIF yoki WEBP formatidagi rasmlar ruxsat etilgan.",
      );
      e.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      // Eslatma: 'file' kaliti backend kutayotgan nomga mos bo'lishi kerak.
      // FastAPI dagi UploadFile parametriga moslang.
      formData.append("file", file);

      const response = await fetch("api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server xatoligi: ${response.status}`);
      }

      const data = await response.json();

      // Backend qaytargan ochiq URL ni formaga uzatamiz
      onChange(data.url);
    } catch (error) {
      console.error("Fayl yuklashda xatolik:", error);
      alert("Rasmni yuklash imkonsiz bo'ldi. Tarmoq ulanishini tekshiring.");
    } finally {
      setIsUploading(false);
      // Keyingi safar xuddi shu faylni tanlaganda ham onChange ishlashi uchun inputni tozalash
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-3"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yuklanmoqda...
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Bosing</span> yoki faylni
                  tashlang
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
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>
      )}

      <div className="mt-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Yoki rasm URL kiriting"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
        />
      </div>
    </div>
  );
}
