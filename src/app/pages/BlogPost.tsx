import { motion } from "motion/react";
import { useParams, Link } from "react-router";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { ReadingProgress } from "../components/ReadingProgress";
import { ShareButtons } from "../components/ShareButtons";
import { TableOfContents } from "../components/TableOfContents";
import { SEOHead } from "../components/SEOHead";
import { Toaster } from "sonner";

import { useQuery } from "@tanstack/react-query";
import { articleService } from "../services/articleService";
import { resolveImageUrl } from "../api/api";

export function BlogPost() {
  const { slug } = useParams();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => articleService.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold mb-4">Maqola topilmadi</h2>
        <Link to="/" className="text-purple-600 hover:underline">Bosh sahifaga qaytish</Link>
      </div>
    );
  }


  return (
    <>
      <SEOHead
        title={article.title}
        description={article.seo_description ?? undefined}
        keywords={article.keywords}
        image={resolveImageUrl(article.image)}
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
              {new Date(article.published_at).toLocaleDateString('uz-UZ', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={18} />
              {article.read_time}
            </span>
          </div>

          <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800">
            <img
              src={resolveImageUrl(article.image)}
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
            dangerouslySetInnerHTML={{ 
              __html: article.content.replace(/src="\/uploads\//g, `src="${resolveImageUrl("/uploads/")}`) 
            }}
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