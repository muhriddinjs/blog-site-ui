import { useState } from "react";
import { motion } from "motion/react";
import { 
  FileText, Briefcase, Award, User, Plus, Edit2, Trash2, Save, X, 
  ArrowLeft, Search, Eye, CheckCircle, Clock
} from "lucide-react";
import { Link } from "react-router";
import { RichTextEditor } from "../components/admin/RichTextEditor";
import { ImageUpload } from "../components/admin/ImageUpload";
import { PreviewModal } from "../components/admin/PreviewModal";
import { toast } from "sonner";

type TabType = "articles" | "projects" | "certificates" | "about";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;
}

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  type: string;
  date: string;
  skills: string[];
  image: string;
  credentialUrl: string;
}

interface AboutData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  stats: { value: string; label: string }[];
}

export function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>("articles");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);

  // Mock data
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      title: "React Best Practices 2026",
      slug: "react-best-practices-2026",
      excerpt: "Zamonaviy React ilovalarini yaratishda eng yaxshi amaliyotlar.",
      category: "Development",
      date: "2026-03-15",
      readTime: "5 daqiqa",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      content: "<h2>Kirish</h2><p>React eng mashhur front-end kutubxonalardan biri...</p>",
      status: "published",
      seoTitle: "React Best Practices 2026 - Complete Guide",
      seoDescription: "Learn the best practices for React development in 2026",
      keywords: ["react", "javascript", "best practices"],
    },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Zamonaviy e-commerce platformasi.",
      category: "Web Development",
      tags: ["React", "Node.js", "MongoDB"],
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
      liveUrl: "#",
      githubUrl: "#",
    },
  ]);

  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 1,
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      type: "Sertifikat",
      date: "2026-02-15",
      skills: ["AWS", "Cloud Architecture"],
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
      credentialUrl: "#",
    },
  ]);

  const [aboutData, setAboutData] = useState<AboutData>({
    name: "Sizning Ismingiz",
    title: "Full Stack Developer & Designer",
    tagline: "Innovatsiya va kreativlik orqali g'oyalarni hayotga tatbiq etaman",
    bio: "Men zamonaviy veb-ilovalar yaratish bilan shug'ullanaman.",
    stats: [
      { value: "50+", label: "Loyihalar" },
      { value: "30+", label: "Maqolalar" },
      { value: "5+", label: "Yillik tajriba" },
    ],
  });

  const tabs = [
    { id: "articles" as TabType, label: "Maqolalar", icon: FileText, count: articles.length },
    { id: "projects" as TabType, label: "Proyektlar", icon: Briefcase, count: projects.length },
    { id: "certificates" as TabType, label: "Sertifikatlar", icon: Award, count: certificates.length },
    { id: "about" as TabType, label: "About Me", icon: User, count: 1 },
  ];

  const handleDelete = (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    
    if (activeTab === "articles") {
      setArticles(articles.filter((item) => item.id !== id));
      toast.success("Maqola o'chirildi");
    } else if (activeTab === "projects") {
      setProjects(projects.filter((item) => item.id !== id));
      toast.success("Proyekt o'chirildi");
    } else if (activeTab === "certificates") {
      setCertificates(certificates.filter((item) => item.id !== id));
      toast.success("Sertifikat o'chirildi");
    }
  };

  const handleSave = (data: any) => {
    if (activeTab === "articles") {
      if (editingItem) {
        setArticles(articles.map((item) => (item.id === editingItem.id ? { ...data, id: editingItem.id } : item)));
        toast.success("Maqola yangilandi");
      } else {
        setArticles([...articles, { ...data, id: Date.now() }]);
        toast.success("Maqola qo'shildi");
      }
    } else if (activeTab === "projects") {
      if (editingItem) {
        setProjects(projects.map((item) => (item.id === editingItem.id ? { ...data, id: editingItem.id } : item)));
        toast.success("Proyekt yangilandi");
      } else {
        setProjects([...projects, { ...data, id: Date.now() }]);
        toast.success("Proyekt qo'shildi");
      }
    } else if (activeTab === "certificates") {
      if (editingItem) {
        setCertificates(certificates.map((item) => (item.id === editingItem.id ? { ...data, id: editingItem.id } : item)));
        toast.success("Sertifikat yangilandi");
      } else {
        setCertificates([...certificates, { ...data, id: Date.now() }]);
        toast.success("Sertifikat qo'shildi");
      }
    } else if (activeTab === "about") {
      setAboutData(data);
      toast.success("About ma'lumotlari yangilandi");
    }

    setEditingItem(null);
    setIsAdding(false);
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCertificates = certificates.filter((cert) =>
    cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sayt kontentini boshqarish
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={18} />
              Saytga qaytish
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditingItem(null);
                setIsAdding(false);
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {!editingItem && !isAdding && activeTab !== "about" && (
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-shadow"
              >
                <Plus size={18} />
                Yangi qo'shish
              </button>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Qidirish..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          )}

          {/* Articles List */}
          {activeTab === "articles" && !editingItem && !isAdding && (
            <ArticlesList articles={filteredArticles} onEdit={setEditingItem} onDelete={handleDelete} onPreview={setPreviewData} />
          )}

          {/* Projects List */}
          {activeTab === "projects" && !editingItem && !isAdding && (
            <ProjectsList projects={filteredProjects} onEdit={setEditingItem} onDelete={handleDelete} />
          )}

          {/* Certificates List */}
          {activeTab === "certificates" && !editingItem && !isAdding && (
            <CertificatesList certificates={filteredCertificates} onEdit={setEditingItem} onDelete={handleDelete} />
          )}

          {/* About Form */}
          {activeTab === "about" && (
            <AboutForm data={aboutData} onSave={handleSave} />
          )}

          {/* Forms */}
          {(editingItem || isAdding) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingItem ? "Tahrirlash" : "Yangi qo'shish"}
                </h2>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsAdding(false);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {activeTab === "articles" && (
                <ArticleForm data={editingItem} onSave={handleSave} onCancel={() => { setEditingItem(null); setIsAdding(false); }} onPreview={setPreviewData} />
              )}

              {activeTab === "projects" && (
                <ProjectForm data={editingItem} onSave={handleSave} onCancel={() => { setEditingItem(null); setIsAdding(false); }} />
              )}

              {activeTab === "certificates" && (
                <CertificateForm data={editingItem} onSave={handleSave} onCancel={() => { setEditingItem(null); setIsAdding(false); }} />
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={!!previewData}
        onClose={() => setPreviewData(null)}
        title="Ko'rib chiqish"
      >
        {previewData && (
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <img src={previewData.image} alt={previewData.title} className="w-full rounded-lg mb-6" />
            <h1>{previewData.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{previewData.excerpt}</p>
            <div dangerouslySetInnerHTML={{ __html: previewData.content }} />
          </article>
        )}
      </PreviewModal>
    </div>
  );
}

// Lists Components
function ArticlesList({ articles, onEdit, onDelete, onPreview }: any) {
  return (
    <div className="grid gap-4">
      {articles.map((article: Article) => (
        <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4">
          <img src={article.image} alt={article.title} className="w-24 h-24 rounded-lg object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{article.title}</h3>
              {article.status === "published" ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <Clock size={16} className="text-yellow-600" />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{article.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {article.category}
              </span>
              <span>{article.date}</span>
              <span>{article.readTime}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onPreview(article)} className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
              <Eye size={18} />
            </button>
            <button onClick={() => onEdit(article)} className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
              <Edit2 size={18} />
            </button>
            <button onClick={() => onDelete(article.id)} className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsList({ projects, onEdit, onDelete }: any) {
  return (
    <div className="grid gap-4">
      {projects.map((project: Project) => (
        <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4">
          <img src={project.image} alt={project.title} className="w-24 h-24 rounded-lg object-cover" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(project)} className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
              <Edit2 size={18} />
            </button>
            <button onClick={() => onDelete(project.id)} className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CertificatesList({ certificates, onEdit, onDelete }: any) {
  return (
    <div className="grid gap-4">
      {certificates.map((cert: Certificate) => (
        <div key={cert.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4">
          <img src={cert.image} alt={cert.title} className="w-24 h-24 rounded-lg object-cover" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{cert.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{cert.issuer}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                {cert.type}
              </span>
              <span>{cert.date}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(cert)} className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
              <Edit2 size={18} />
            </button>
            <button onClick={() => onDelete(cert.id)} className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Form Components (continuing in next message due to length)
function ArticleForm({ data, onSave, onCancel, onPreview }: any) {
  const [formData, setFormData] = useState(
    data || {
      title: "",
      slug: "",
      excerpt: "",
      category: "Development",
      date: new Date().toISOString().split("T")[0],
      readTime: "",
      image: "",
      content: "",
      status: "draft",
      seoTitle: "",
      seoDescription: "",
      keywords: [],
    }
  );

  const [keywordInput, setKeywordInput] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formData);
      }}
      className="space-y-6"
    >
      {/* Basic Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Sarlavha</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Qisqacha mazmun</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
          rows={3}
          required
        />
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Kategoriya</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
          >
            <option>Development</option>
            <option>Design</option>
            <option>Performance</option>
            <option>Backend</option>
            <option>AI</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
          >
            <option value="draft">Qoralama</option>
            <option value="published">E'lon qilingan</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sana</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">O'qish vaqti</label>
          <input
            type="text"
            value={formData.readTime}
            onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
            placeholder="5 daqiqa"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            required
          />
        </div>
      </div>

      {/* Image Upload */}
      <ImageUpload
        value={formData.image}
        onChange={(url) => setFormData({ ...formData, image: url })}
      />

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium mb-2">Kontent</label>
        <RichTextEditor
          value={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
        />
      </div>

      {/* SEO Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">SEO Title</label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder={formData.title}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">SEO Description</label>
            <textarea
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder={formData.excerpt}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Keywords</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (keywordInput.trim()) {
                      setFormData({ ...formData, keywords: [...(formData.keywords || []), keywordInput.trim()] });
                      setKeywordInput("");
                    }
                  }
                }}
                placeholder="Keyword kiriting va Enter bosing"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.keywords || []).map((keyword: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm flex items-center gap-2"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, keywords: formData.keywords.filter((_: any, i: number) => i !== index) })}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-shadow"
        >
          <Save size={18} />
          Saqlash
        </button>
        <button
          type="button"
          onClick={() => onPreview(formData)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        >
          <Eye size={18} />
          Ko'rib chiqish
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={18} />
          Bekor qilish
        </button>
      </div>
    </form>
  );
}

// ProjectForm and CertificateForm remain the same as before, but with ImageUpload component
function ProjectForm({ data, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(
    data || {
      title: "",
      description: "",
      category: "Web Development",
      tags: [],
      image: "",
      liveUrl: "",
      githubUrl: "",
    }
  );

  const [tagInput, setTagInput] = useState("");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nomi</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Kategoriya</label>
          <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Ta'rif</label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" rows={3} required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Teglar</label>
        <div className="flex gap-2 mb-2">
          <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (tagInput.trim()) { setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] }); setTagInput(""); } } }} placeholder="Teg kiriting va Enter bosing" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
          <button type="button" onClick={() => { if (tagInput.trim()) { setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] }); setTagInput(""); } }} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Qo'shish</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag: string, index: number) => (
            <span key={index} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm flex items-center gap-2">
              {tag}
              <button type="button" onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_: any, i: number) => i !== index) })} className="text-red-600 hover:text-red-700"><X size={14} /></button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Live URL</label>
          <input type="url" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">GitHub URL</label>
          <input type="url" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
        </div>
      </div>

      <ImageUpload value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />

      <div className="flex gap-3">
        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-shadow"><Save size={18} />Saqlash</button>
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={18} />Bekor qilish</button>
      </div>
    </form>
  );
}

function CertificateForm({ data, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(
    data || {
      title: "",
      issuer: "",
      type: "Sertifikat",
      date: new Date().toISOString().split("T")[0],
      skills: [],
      image: "",
      credentialUrl: "",
    }
  );

  const [skillInput, setSkillInput] = useState("");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nomi</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Beruvchi</label>
          <input type="text" value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Turi</label>
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
            <option>Sertifikat</option>
            <option>Diplom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sana</label>
          <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Ko'nikmalar</label>
        <div className="flex gap-2 mb-2">
          <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (skillInput.trim()) { setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] }); setSkillInput(""); } } }} placeholder="Ko'nikma kiriting va Enter bosing" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
          <button type="button" onClick={() => { if (skillInput.trim()) { setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] }); setSkillInput(""); } }} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Qo'shish</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill: string, index: number) => (
            <span key={index} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm flex items-center gap-2">
              {skill}
              <button type="button" onClick={() => setFormData({ ...formData, skills: formData.skills.filter((_: any, i: number) => i !== index) })} className="text-red-600 hover:text-red-700"><X size={14} /></button>
            </span>
          ))}
        </div>
      </div>

      <ImageUpload value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />

      <div>
        <label className="block text-sm font-medium mb-2">Credential URL</label>
        <input type="url" value={formData.credentialUrl} onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
      </div>

      <div className="flex gap-3">
        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-shadow"><Save size={18} />Saqlash</button>
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={18} />Bekor qilish</button>
      </div>
    </form>
  );
}

function AboutForm({ data, onSave }: any) {
  const [formData, setFormData] = useState(data);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Ism</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Lavozim</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tagline</label>
        <input type="text" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" rows={4} required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Statistika</label>
        <div className="space-y-3">
          {formData.stats.map((stat: any, index: number) => (
            <div key={index} className="flex gap-3">
              <input type="text" value={stat.value} onChange={(e) => { const newStats = [...formData.stats]; newStats[index].value = e.target.value; setFormData({ ...formData, stats: newStats }); }} placeholder="50+" className="w-1/3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
              <input type="text" value={stat.label} onChange={(e) => { const newStats = [...formData.stats]; newStats[index].label = e.target.value; setFormData({ ...formData, stats: newStats }); }} placeholder="Loyihalar" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-shadow">
        <Save size={18} />
        O'zgarishlarni saqlash
      </button>
    </form>
  );
}
