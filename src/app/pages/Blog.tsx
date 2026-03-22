import { motion } from "motion/react";
import { Link } from "react-router";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";

export function Blog() {
  // This data will be fetched from API: GET /api/articles
  const articles = [
    {
      id: 1,
      slug: "react-best-practices-2026",
      title: "React Best Practices 2026 yilda",
      excerpt: "Zamonaviy React ilovalarini yaratishda eng yaxshi amaliyotlar va tavsiyalar.",
      date: "2026-03-15",
      readTime: "5 daqiqa",
      category: "Development",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    },
    {
      id: 2,
      slug: "typescript-advanced-patterns",
      title: "TypeScript Advanced Patterns",
      excerpt: "TypeScript'da ilg'or pattern'lar va ulardan qanday foydalanish.",
      date: "2026-03-10",
      readTime: "8 daqiqa",
      category: "Development",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
    },
    {
      id: 3,
      slug: "ui-ux-trends-2026",
      title: "UI/UX Trends 2026",
      excerpt: "2026 yilning eng so'nggi dizayn tendentsiyalari va qo'llanmalari.",
      date: "2026-03-05",
      readTime: "6 daqiqa",
      category: "Design",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
    },
    {
      id: 4,
      slug: "web-performance-optimization",
      title: "Web Performance Optimization",
      excerpt: "Veb-saytingiz tezligini oshirish uchun amaliy maslahatlar.",
      date: "2026-02-28",
      readTime: "7 daqiqa",
      category: "Performance",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    },
    {
      id: 5,
      slug: "nodejs-microservices",
      title: "Node.js Microservices Architecture",
      excerpt: "Node.js da microservices arxitekturasini qurish bo'yicha qo'llanma.",
      date: "2026-02-20",
      readTime: "10 daqiqa",
      category: "Backend",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    },
    {
      id: 6,
      slug: "ai-integration-web-apps",
      title: "AI Integration in Web Applications",
      excerpt: "Sun'iy intellekt texnologiyalarini veb-ilovalaringizga qo'shish.",
      date: "2026-02-15",
      readTime: "9 daqiqa",
      category: "AI",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    },
  ];

  const categories = ["Hammasi", "Development", "Design", "Performance", "Backend", "AI"];
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");

  const filteredArticles = selectedCategory === "Hammasi"
    ? articles
    : articles.filter((article) => article.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Maqolalar</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Dasturlash, dizayn va texnologiya haqida o'z tajribalarim va bilimlarim.
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

      <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
        {filteredArticles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              to={`/blog/${article.slug}`}
              className="block group h-full"
            >
              <div className="h-full rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
                <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(article.date).toLocaleDateString('uz-UZ')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {article.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {article.title}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium">
                    O'qish <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}