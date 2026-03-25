import { useState } from "react";
import { motion } from "motion/react";
import { 
  FileText, Briefcase, Award, User, Plus, Edit2, Trash2, Save, X, 
  ArrowLeft, Search, Eye, CheckCircle, Clock
} from "lucide-react";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { articleService } from "../services/articleService";
import { portfolioService } from "../services/portfolioService";
import { certificateService } from "../services/certificateService";
import { authService } from "../services/authService";
import { aboutService } from "../services/aboutService";
import { RichTextEditor } from "../components/admin/RichTextEditor";
import { ImageUpload } from "../components/admin/ImageUpload";
import { PreviewModal } from "../components/admin/PreviewModal";
import { Snackbar, Alert, AlertProps } from "@mui/material";
import { LogOut, Key } from "lucide-react";

type TabType = "articles" | "projects" | "certificates" | "about";

interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  published_at: string;
  read_time: string;
  image: string;
  content: string;
  status: "draft" | "published";
  seo_title?: string;
  seo_description?: string;
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
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("articles");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ old: "", new: "" });

  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: AlertProps['severity']}>({
    open: false,
    message: "",
    severity: "success"
  });

  const showMessage = (msg: string, severity: AlertProps['severity'] = "success") => {
    setSnackbar({ open: true, message: msg, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Articles Query
  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: () => articleService.adminGetAll(),
    enabled: activeTab === "articles",
  });

  // Articles Mutations
  const createMutation = useMutation({
    mutationFn: (newArticle: any) => articleService.create(newArticle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      showMessage("Maqola qo'shildi", "success");
      setIsAdding(false);
    },
    onError: () => showMessage("Xatolik yuz berdi", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => articleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      showMessage("Maqola yangilandi", "success");
      setEditingItem(null);
    },
    onError: () => showMessage("Xatolik yuz berdi", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => articleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      showMessage("Maqola o'chirildi", "success");
    },
    onError: () => showMessage("Xatolik yuz berdi", "error"),
  });

  // Projects Query
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => portfolioService.adminGetAll(),
    enabled: activeTab === "projects",
  });

  // Certificates Query
  const { data: certificates = [], isLoading: certificatesLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: () => certificateService.adminGetAll(),
    enabled: activeTab === "certificates",
  });

  // About Query & Mutation
  const { data: aboutData, isLoading: aboutLoading } = useQuery({
    queryKey: ["about"],
    queryFn: () => aboutService.adminGet(),
    enabled: activeTab === "about",
  });

  const updateAboutMutation = useMutation({
    mutationFn: (data: any) => aboutService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      showMessage("About ma'lumotlari yangilandi", "success");
    },
    onError: () => showMessage("Xatolik yuz berdi", "error"),
  });

  // Project Mutations
  const createProjectMutation = useMutation({
    mutationFn: (newProject: any) => portfolioService.create(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      showMessage("Proyekt qo'shildi", "success");
      setIsAdding(false);
    },
    onError: () => showMessage("Xatolik yuz berdi", "error"),
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => portfolioService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      showMessage("Proyekt yangilandi", "success");
      setEditingItem(null);
    },
    onError: () => showMessage("Xatolik yuz berdi", "error"),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => portfolioService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      showMessage("Proyekt o'chirildi", "success");
    },
    onError: () => showMessage("Xatolik yuz berdi", "error"),
  });

  // Certificate Mutations
  const createCertMutation = useMutation({
    mutationFn: (newCert: any) => certificateService.create(newCert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      showMessage("Sertifikat qo'shildi", "success");
      setIsAdding(false);
    },
    onError: () => showMessage("Xatolik yuz berdi", "error"),
  });

  const updateCertMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => certificateService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      showMessage("Sertifikat yangilandi", "success");
      setEditingItem(null);
    },
    onError: () => showMessage("Xatolik yuz berdi", "error"),
  });

  const deleteCertMutation = useMutation({
    mutationFn: (id: number) => certificateService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      showMessage("Sertifikat o'chirildi", "success");
    },
    onError: () => showMessage("Xatolik yuz berdi", "error"),
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
      deleteMutation.mutate(id);
    } else if (activeTab === "projects") {
      deleteProjectMutation.mutate(id);
    } else if (activeTab === "certificates") {
      deleteCertMutation.mutate(id);
    }
  };

  const handleSave = (data: any) => {
    if (activeTab === "articles") {
      if (editingItem) {
        updateMutation.mutate({ id: editingItem.id, data });
      } else {
        createMutation.mutate(data);
      }
    } else if (activeTab === "projects") {
      if (editingItem) {
        updateProjectMutation.mutate({ id: editingItem.id, data });
      } else {
        createProjectMutation.mutate(data);
      }
    } else if (activeTab === "certificates") {
      if (editingItem) {
        updateCertMutation.mutate({ id: editingItem.id, data });
      } else {
        createCertMutation.mutate(data);
      }
    } else if (activeTab === "about") {
      updateAboutMutation.mutate(data);
    }

    if (activeTab !== "articles" && activeTab !== "projects" && activeTab !== "certificates") {
      setEditingItem(null);
      setIsAdding(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.changePassword(passwordData.old, passwordData.new);
      showMessage("Parol muvaffaqiyatli o'zgartirildi", "success");
      setIsChangingPassword(false);
      setPasswordData({ old: "", new: "" });
    } catch (err) {
      showMessage("Parolni o'zgartirishda xatolik", "error");
    }
  };


  const filteredArticles = articles.filter((article: any) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const filteredProjects = projects.filter((project: any) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCertificates = certificates.filter((cert: any) =>
    cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsChangingPassword(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Parolni o'zgartirish"
              >
                <Key size={18} />
                <span className="hidden sm:inline">Parol</span>
              </button>
              <button
                onClick={() => authService.logout()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                title="Chiqish"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
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
            articlesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <ArticlesList articles={filteredArticles} onEdit={setEditingItem} onDelete={handleDelete} onPreview={setPreviewData} />
            )
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
            aboutLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <AboutForm data={aboutData} onSave={handleSave} />
            )
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
            <p className="text-gray-600 dark:text-gray-400">{previewData.summary}</p>
            <div dangerouslySetInnerHTML={{ __html: previewData.content }} />
          </article>
        )}
      </PreviewModal>

      {/* Password Change Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Key className="text-purple-600" size={24} />
                Parolni o'zgartirish
              </h2>
              <button
                onClick={() => setIsChangingPassword(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Eski parol</label>
                <input
                  type="password"
                  value={passwordData.old}
                  onChange={(e) => setPasswordData({ ...passwordData, old: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Yangi parol</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-colors"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{article.summary}</p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {article.category}
              </span>
              <span>{new Date(article.published_at).toLocaleDateString()}</span>
              <span>{article.read_time}</span>
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
      {projects.map((project: any) => (
        <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4">
          <img src={project.image} alt={project.name} className="w-24 h-24 rounded-lg object-cover" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tag: string) => (
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
      {certificates.map((cert: any) => (
        <div key={cert.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4">
          <img src={cert.image} alt={cert.name} className="w-24 h-24 rounded-lg object-cover" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{cert.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{cert.issuer}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                {cert.certificate_type}
              </span>
              <span>{cert.issued_date ? new Date(cert.issued_date).toLocaleDateString() : "Sana yo'q"}</span>
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
  const [formData, setFormData] = useState(() => {
    if (data) {
      return {
        ...data,
        published_at: data.published_at ? data.published_at.split("T")[0] : new Date().toISOString().split("T")[0],
      };
    }
    return {
      title: "",
      slug: "",
      summary: "",
      category: "other",
      published_at: new Date().toISOString().split("T")[0],
      read_time: "",
      image: "",
      content: "",
      status: "draft",
      seo_title: "",
      seo_description: "",
      keywords: [],
    };
  });

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
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
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
            <option value="design">Design</option>
            <option value="performance">Performance</option>
            <option value="backend">Backend</option>
            <option value="frontend">Frontend</option>
            <option value="devops">DevOps</option>
            <option value="mobile">Mobile</option>
            <option value="other">Other</option>
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
            value={formData.published_at}
            onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">O'qish vaqti</label>
          <input
            type="text"
            value={formData.read_time}
            onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
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
              value={formData.seo_title}
              onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
              placeholder={formData.title}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">SEO Description</label>
            <textarea
              value={formData.seo_description}
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              placeholder={formData.summary}
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
      name: "",
      description: "",
      category: "web",
      technologies: [],
      image: "",
      live_url: "",
      github_url: "",
    }
  );

  const [tagInput, setTagInput] = useState("");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nomi</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Kategoriya</label>
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" 
            required
          >
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="design">Design</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Fullstack</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Ta'rif</label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" rows={3} required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Texnologiyalar</label>
        <div className="flex gap-2 mb-2">
          <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (tagInput.trim()) { setFormData({ ...formData, technologies: [...formData.technologies, tagInput.trim()] }); setTagInput(""); } } }} placeholder="Texnologiya kiriting va Enter bosing" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
          <button type="button" onClick={() => { if (tagInput.trim()) { setFormData({ ...formData, technologies: [...formData.technologies, tagInput.trim()] }); setTagInput(""); } }} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Qo'shish</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technologies.map((tag: string, index: number) => (
            <span key={index} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm flex items-center gap-2">
              {tag}
              <button type="button" onClick={() => setFormData({ ...formData, technologies: formData.technologies.filter((_: any, i: number) => i !== index) })} className="text-red-600 hover:text-red-700"><X size={14} /></button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Live URL</label>
          <input type="url" value={formData.live_url} onChange={(e) => setFormData({ ...formData, live_url: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">GitHub URL</label>
          <input type="url" value={formData.github_url} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
        </div>
      </div>

      <ImageUpload value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />



      <div className="flex gap-3 pt-4">
        <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-shadow"><Save size={18} />Saqlash</button>
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={18} />Bekor qilish</button>
      </div>
    </form>
  );
}

function CertificateForm({ data, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(
    data || {
      name: "",
      issuer: "",
      certificate_type: "certificate",
      issued_date: new Date().toISOString().split("T")[0],
      skills: [],
      image: "",
      credential_url: "",
    }
  );

  const [skillInput, setSkillInput] = useState("");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nomi</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Beruvchi</label>
          <input type="text" value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Turi</label>
          <select 
            value={formData.certificate_type} 
            onChange={(e) => setFormData({ ...formData, certificate_type: e.target.value })} 
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
          >
            <option value="certificate">Sertifikat</option>
            <option value="diploma">Diplom</option>
            <option value="course">Kurs</option>
            <option value="badge">Badge</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sana</label>
          <input type="date" value={formData.issued_date} onChange={(e) => setFormData({ ...formData, issued_date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" required />
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
        <input type="url" value={formData.credential_url} onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
      </div>

      <div className="flex gap-3">
        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-shadow"><Save size={18} />Saqlash</button>
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={18} />Bekor qilish</button>
      </div>
    </form>
  );
}

function AboutForm({ data, onSave }: any) {
  const [formData, setFormData] = useState(data || {
    name: "Sizning Ismingiz",
    title: "Full Stack Developer",
    tagline: "",
    bio: "",
    stats: []
  });

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
