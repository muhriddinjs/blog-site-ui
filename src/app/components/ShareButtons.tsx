import { Facebook, Twitter, Linkedin, Link as LinkIcon, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const shareUrl = url || window.location.href;

  const handleShare = (platform: string) => {
    let shareLink = "";

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "telegram":
        shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
        break;
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Havola nusxalandi!");
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Ulashish:
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => handleShare("facebook")}
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          aria-label="Facebook'da ulashish"
        >
          <Facebook size={18} />
        </button>
        <button
          onClick={() => handleShare("twitter")}
          className="p-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
          aria-label="Twitter'da ulashish"
        >
          <Twitter size={18} />
        </button>
        <button
          onClick={() => handleShare("linkedin")}
          className="p-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
          aria-label="LinkedIn'da ulashish"
        >
          <Linkedin size={18} />
        </button>
        <button
          onClick={() => handleShare("telegram")}
          className="p-2 rounded-lg bg-sky-400 text-white hover:bg-sky-500 transition-colors"
          aria-label="Telegram'da ulashish"
        >
          <MessageCircle size={18} />
        </button>
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Havolani nusxalash"
        >
          <LinkIcon size={18} />
        </button>
      </div>
    </div>
  );
}
