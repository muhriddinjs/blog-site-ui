import { motion } from "motion/react";
import { Code2, Palette, Zap, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { aboutService } from "../services/aboutService";

export function Home() {
  // Fetch data from API
  const { data: serverAboutData, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: () => aboutService.get(),
  });

  const aboutData = {
    name: serverAboutData?.name || "Sizning Ismingiz",
    title: serverAboutData?.title || "Full Stack Developer & Designer",
    tagline: serverAboutData?.tagline || "Innovatsiya va kreativlik orqali g'oyalarni hayotga tatbiq etaman",
    bio: serverAboutData?.bio || "Men zamonaviy veb-ilovalar yaratish bilan shug'ullanaman. React, Node.js va boshqa texnologiyalar yordamida foydalanuvchilar uchun ajoyib tajribalar yarataman.",
    stats: serverAboutData?.stats?.length ? serverAboutData.stats : [
      { value: "50+", label: "Loyihalar" },
      { value: "30+", label: "Maqolalar" },
      { value: "5+", label: "Yillik tajriba" },
    ],
    skills: [
      { icon: Code2, title: "Development", description: "React, Node.js, TypeScript, Python" },
      { icon: Palette, title: "Design", description: "UI/UX, Figma, Responsive Design" },
      { icon: Zap, title: "Performance", description: "Optimization, Best Practices, Clean Code" },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 text-sm font-medium"
          >
            <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
            <span className="text-gray-700 dark:text-gray-300">Salom, Xush kelibsiz!</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Men{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {aboutData.name}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-400 mb-4 font-medium"
          >
            {aboutData.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-gray-500 dark:text-gray-500 mb-12 max-w-2xl mx-auto italic"
          >
            "{aboutData.tagline}"
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              to="/"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
            >
              Maqolalarni o'qish 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-105"
            >
              Portfolio ko'rish
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {aboutData.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 border-t border-gray-200 dark:border-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Men nima qilaman?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {aboutData.bio}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutData.skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <skill.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}