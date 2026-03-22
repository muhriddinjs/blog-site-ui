import { motion } from "motion/react";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { useState } from "react";

export function Certificates() {
  // This data will be fetched from API: GET /api/certificates
  const certificates = [
    {
      id: 1,
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2026-02-15",
      type: "Sertifikat",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
      credentialUrl: "#",
      skills: ["AWS", "Cloud Architecture", "DevOps"],
    },
    {
      id: 2,
      title: "Bachelor's Degree in Computer Science",
      issuer: "Toshkent Axborot Texnologiyalari Universiteti",
      date: "2025-06-30",
      type: "Diplom",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
      credentialUrl: "#",
      skills: ["Computer Science", "Algorithms", "Data Structures"],
    },
    {
      id: 3,
      title: "React Developer Certification",
      issuer: "Meta",
      date: "2025-11-20",
      type: "Sertifikat",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
      credentialUrl: "#",
      skills: ["React", "JavaScript", "Front-end Development"],
    },
    {
      id: 4,
      title: "Google UX Design Professional",
      issuer: "Google",
      date: "2025-09-10",
      type: "Sertifikat",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      credentialUrl: "#",
      skills: ["UX Design", "Figma", "User Research"],
    },
    {
      id: 5,
      title: "Full Stack Web Development",
      issuer: "freeCodeCamp",
      date: "2025-03-15",
      type: "Sertifikat",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      credentialUrl: "#",
      skills: ["HTML", "CSS", "JavaScript", "Node.js"],
    },
    {
      id: 6,
      title: "Python for Data Science",
      issuer: "IBM",
      date: "2024-12-01",
      type: "Sertifikat",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
      credentialUrl: "#",
      skills: ["Python", "Data Analysis", "Machine Learning"],
    },
  ];

  const types = ["Hammasi", "Diplom", "Sertifikat"];
  const [selectedType, setSelectedType] = useState("Hammasi");

  const filteredCertificates = selectedType === "Hammasi"
    ? certificates
    : certificates.filter((cert) => cert.type === selectedType);

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
                src={certificate.image}
                alt={certificate.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-sm font-medium flex items-center gap-1">
                  <Award size={14} />
                  {certificate.type}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                {certificate.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {certificate.issuer}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 mb-4">
                <Calendar size={14} />
                {new Date(certificate.date).toLocaleDateString('uz-UZ', {
                  year: 'numeric',
                  month: 'long',
                })}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {certificate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <a
                href={certificate.credentialUrl}
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
