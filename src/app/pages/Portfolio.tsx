import { motion } from "motion/react";
import { ExternalLink, Github } from "lucide-react";
import { useState } from "react";

export function Portfolio() {
  // This data will be fetched from API: GET /api/projects
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Zamonaviy e-commerce platformasi React va Node.js yordamida yaratilgan.",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      liveUrl: "#",
      githubUrl: "#",
      category: "Web Development",
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Jamoa uchun vazifalarni boshqarish ilovasi.",
      image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=800&h=600&fit=crop",
      tags: ["React", "TypeScript", "Firebase", "Tailwind"],
      liveUrl: "#",
      githubUrl: "#",
      category: "Web App",
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "Kreativ portfolio veb-sayt dizayn va development.",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
      tags: ["React", "Framer Motion", "Tailwind CSS"],
      liveUrl: "#",
      githubUrl: "#",
      category: "Design",
    },
    {
      id: 4,
      title: "Weather Dashboard",
      description: "Real-time ob-havo ma'lumotlarini ko'rsatuvchi dashboard.",
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop",
      tags: ["React", "API Integration", "Charts", "Responsive"],
      liveUrl: "#",
      githubUrl: "#",
      category: "Web App",
    },
    {
      id: 5,
      title: "Social Media App",
      description: "Social media ilovasi React Native bilan yaratilgan.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
      tags: ["React Native", "Redux", "Node.js", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "#",
      category: "Mobile",
    },
    {
      id: 6,
      title: "Analytics Platform",
      description: "Ma'lumotlarni tahlil qilish va vizualizatsiya platformasi.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      tags: ["React", "D3.js", "Python", "FastAPI"],
      liveUrl: "#",
      githubUrl: "#",
      category: "Data Science",
    },
  ];

  const categories = ["Hammasi", "Web Development", "Web App", "Mobile", "Design", "Data Science"];
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");

  const filteredProjects = selectedCategory === "Hammasi"
    ? projects
    : projects.filter((project) => project.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Portfolio</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Men yaratgan loyihalar va ishlar to'plami.
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 flex flex-wrap gap-3"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
          >
            <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-4 pb-4">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={18} />
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={18} />
                </a>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
