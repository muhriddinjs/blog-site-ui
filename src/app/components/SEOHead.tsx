import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}

export function SEOHead({
  title,
  description = "Dasturlash, dizayn va texnologiya haqida maqolalar",
  keywords = [],
  image = "/og-image.jpg",
  url,
  type = "article",
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Portfolio`;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateMetaName = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMetaName("description", description);
    if (keywords.length > 0) {
      updateMetaName("keywords", keywords.join(", "));
    }

    // Open Graph
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:type", type);
    updateMetaTag("og:image", image);
    if (url) {
      updateMetaTag("og:url", url);
    }

    // Twitter Card
    updateMetaName("twitter:card", "summary_large_image");
    updateMetaName("twitter:title", title);
    updateMetaName("twitter:description", description);
    updateMetaName("twitter:image", image);
  }, [title, description, keywords, image, url, type]);

  return null;
}
