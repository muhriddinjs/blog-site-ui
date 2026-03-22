import { motion } from "motion/react";
import { useParams, Link } from "react-router";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { ReadingProgress } from "../components/ReadingProgress";
import { ShareButtons } from "../components/ShareButtons";
import { TableOfContents } from "../components/TableOfContents";
import { SEOHead } from "../components/SEOHead";
import { Toaster } from "sonner";

export function BlogPost() {
  const { slug } = useParams();

  // This data will be fetched from API: GET /api/articles/:slug
  const article = {
    slug: slug,
    title: "React Best Practices 2026 yilda",
    date: "2026-03-15",
    readTime: "5 daqiqa",
    category: "Development",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop",
    content: `
      <h2 id="kirish">Kirish</h2>
      <p>React hozirgi kunda eng mashhur front-end kutubxonalardan biri hisoblanadi. 2026 yilda React bilan ishlashning eng yaxshi amaliyotlarini ko'rib chiqamiz.</p>
      
      <h2 id="hooks">1. Hooks dan to'g'ri foydalanish</h2>
      <p>React Hooks zamonaviy React dasturlashning asosiy qismidir. useState, useEffect, va boshqa hooklar dan samarali foydalanish muhim.</p>
      
      <h3 id="usestate">useState Hook</h3>
      <p>useState hook komponentda state boshqarish uchun ishlatiladi. Uni to'g'ri ishlatish performance ga ta'sir qiladi.</p>
      
      <h2 id="component-structure">2. Component tuzilishi</h2>
      <p>Componentlarni kichik va qayta ishlatilishi mumkin bo'lgan qilib yaratish kerak. Har bir component bitta vazifani bajarishi kerak.</p>
      
      <h3 id="separation">Separation of Concerns</h3>
      <p>Logic va UI ni ajratish code'ni tushunish va maintain qilishni osonlashtiradi.</p>
      
      <h2 id="performance">3. Performance optimizatsiyasi</h2>
      <p>React.memo, useMemo, va useCallback dan foydalanib performanceni yaxshilash mumkin. Lekin bularni ortiqcha ishlatmaslik ham muhim.</p>
      
      <h3 id="memo">React.memo</h3>
      <p>Component qayta render bo'lishini oldini olish uchun React.memo dan foydalaning.</p>
      
      <h2 id="xulosa">Xulosa</h2>
      <p>React bilan ishlashda bu best practicelarni amal qilish sizning ilovangizni samarali va maintainable qiladi.</p>
    `,
    seoTitle: "React Best Practices 2026 - Complete Guide",
    seoDescription: "Learn the best practices for React development in 2026. Comprehensive guide covering hooks, component structure, and performance optimization.",
    keywords: ["react", "javascript", "best practices", "2026", "hooks", "performance"],
  };

  return (
    <>
      <SEOHead
        title={article.title}
        description={article.seoDescription}
        keywords={article.keywords}
        image={article.image}
        type="article"
      />
      
      <ReadingProgress />
      <Toaster position="bottom-right" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Orqaga
          </Link>

          <div className="mb-8">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
            <span className="flex items-center gap-2">
              <Calendar size={18} />
              {new Date(article.date).toLocaleDateString('uz-UZ', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={18} />
              {article.readTime}
            </span>
          </div>

          <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Share Buttons */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            <ShareButtons title={article.title} />
          </div>

          <article
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:scroll-mt-24
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-gray-100
              prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share Buttons at Bottom */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <ShareButtons title={article.title} />
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-shadow"
            >
              <ArrowLeft size={18} />
              Boshqa maqolalar
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Table of Contents - Only visible on large screens */}
      <TableOfContents />
    </>
  );
}