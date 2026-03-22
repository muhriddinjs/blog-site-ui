import { Github, Linkedin, Mail, Twitter, Heart, Code2 } from "lucide-react";
import { Link } from "react-router";

export function Footer() {
  // These can be replaced with actual social links from API
  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "mailto:example@email.com", label: "Email" },
  ];

  const footerLinks = [
    { label: "Maqolalar", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Sertifikatlar", href: "/certificates" },
    { label: "Haqimda", href: "/about" },
  ];

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Portfolio
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Dasturlash, dizayn va texnologiya haqida maqolalar va loyihalar.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Code2 size={16} />
              <span>React & Tailwind CSS bilan yaratilgan</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Tezkor havolalar</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Ijtimoiy tarmoqlar</h3>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all hover:scale-110"
                  aria-label={link.label}
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            © {new Date().getFullYear()} Portfolio. Made with <Heart size={14} className="text-red-500 fill-red-500" /> in Uzbekistan
          </p>
          
          <div className="text-xs text-gray-500 dark:text-gray-500">
            <span className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Barcha huquqlar himoyalangan
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}