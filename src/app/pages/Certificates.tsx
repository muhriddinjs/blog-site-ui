import { motion } from "motion/react";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { certificateService } from "../services/certificateService";
import { resolveImageUrl } from "../api/api";

export function Certificates() {
  const [selectedType, setSelectedType] = useState("Hammasi");

  const { data: certificates = [], isLoading, error } = useQuery({
    queryKey: ["certificates"],
    queryFn: () => certificateService.getAll(),
  });

  const types = ["Hammasi", ...new Set(certificates.map((c: any) => c.certificate_type))];

  const filteredCertificates = selectedType === "Hammasi"
    ? certificates
    : certificates.filter((cert: any) => cert.certificate_type === selectedType);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        Xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Diplom va Sertifikatlar</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Professional sertifikatlar va ta'lim diplomilarim.
        </p>
      </motion.div>

      {/* Type Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 flex flex-wrap gap-3"
      >
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedType === type
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {type}
          </button>
        ))}
      </motion.div>

      {/* Certificates Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map((certificate, index) => (
          <motion.div
            key={certificate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
          >
            <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
              <img
                src={resolveImageUrl(certificate.image)}
                alt={certificate.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-sm font-medium flex items-center gap-1">
                  <Award size={14} />
                  {certificate.certificate_type}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                {certificate.name}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {certificate.issuer}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 mb-4">
                <Calendar size={14} />
                {certificate.issued_date ? new Date(certificate.issued_date).toLocaleDateString('uz-UZ', {
                  year: 'numeric',
                  month: 'long',
                }) : "Sana ko'rsatilmadi"}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {certificate.skills?.map((skill: any) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <a
                href={certificate.credential_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm transition-colors"
              >
                Sertifikatni ko'rish <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
