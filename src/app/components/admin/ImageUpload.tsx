import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Rasm" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real application, you would upload to your server or cloud storage
    // For now, we'll create a local URL
    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);

    // TODO: Replace with actual upload to server
    // const formData = new FormData();
    // formData.append('image', file);
    // const response = await fetch('/api/upload', { method: 'POST', body: formData });
    // const data = await response.json();
    // onChange(data.url);
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
