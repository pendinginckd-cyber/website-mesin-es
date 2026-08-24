"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUploadSingle } from "@/components/ui/image-upload-single";
import { ChevronDown, ChevronUp, Plus, Trash2, Edit2 } from "lucide-react";
import { getArticles, createArticle, updateArticle, deleteArticle } from "@/lib/firestore/articles";
import { Article } from "@/types/article";

const ReactQuill = dynamic(() => import("@/components/ui/react-quill-wrapper"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface ArticleFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string;
  isPublished: boolean;
  publishedAt: string;
}

const initialFormData: ArticleFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  coverImage: "",
  author: "",
  category: "",
  tags: "",
  isPublished: false,
  publishedAt: new Date().toISOString().slice(0, 16),
};

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

function InputField({ value, onChange, required, type = "text", placeholder, name, maxLength }: {
  value: string | number;
  onChange: (name: string, value: string | number | boolean) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  name: string;
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(name, type === "number" ? Number(e.target.value) : e.target.value)}
      required={required}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
    />
  );
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    [{ align: [] }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "link",
  "image",
  "align",
];

export default function ArtikelAdmin() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const uniqueCategories = [...new Set(articles.map((a) => a.category).filter(Boolean))];
    setCategories(uniqueCategories);
  }, [articles]);

  async function fetchArticles() {
    setLoading(true);
    try {
      const data = await getArticles();
      console.log("Fetched articles count:", data.length);
      console.log("Fetched articles:", data.map(a => ({ id: a.id, title: a.title, isPublished: a.isPublished })));
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
    setLoading(false);
  }

  function handleChange(name: string, value: string | number | boolean) {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "title" && typeof value === "string" && !editingId) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  }

  function openNewForm() {
    setFormData({
      ...initialFormData,
      publishedAt: new Date().toISOString().slice(0, 16),
    });
    setEditingId(null);
    setShowForm(true);
    setShowCategoryInput(false);
  }

  function openEditForm(article: Article) {
    setFormData({
      title: article.title || "",
      slug: article.slug || "",
      content: article.content || "",
      excerpt: article.excerpt || "",
      coverImage: article.coverImage || "",
      author: article.author || "",
      category: article.category || "",
      tags: (article.tags || []).join(", "),
      isPublished: article.isPublished ?? false,
      publishedAt: article.publishedAt
        ? new Date(article.publishedAt).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
    });
    setEditingId(article.id);
    setShowForm(true);
    setShowCategoryInput(false);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormData);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        coverImage: formData.coverImage,
        author: formData.author,
        category: formData.category,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        isPublished: formData.isPublished,
        publishedAt: new Date(formData.publishedAt),
      };

      if (editingId) {
        await updateArticle(editingId, submitData);
        alert("Artikel berhasil diupdate!");
      } else {
        await createArticle(submitData);
        alert("Artikel berhasil ditambahkan!");
      }

      closeForm();
      fetchArticles();
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Gagal menyimpan artikel. Silakan coba lagi.");
    }

    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;

    try {
      await deleteArticle(id);
      alert("Artikel berhasil dihapus!");
      fetchArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Gagal menghapus artikel.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Artikel</h2>
        <Button variant="primary" onClick={openNewForm}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Artikel
        </Button>
      </div>

      {showForm && (
        <Card className="max-w-4xl">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Artikel" : "Tambah Artikel Baru"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Judul Artikel</Label>
                  <InputField
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Cara Merawat Mesin Es Kristal"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.title.length}/100 karakter
                  </p>
                </div>

                <div>
                  <Label>Slug</Label>
                  <InputField
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    placeholder="cara-merawat-mesin-es-kristal"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Otomatis dari judul, bisa diedit manual
                  </p>
                </div>

                <div>
                  <Label>Penulis</Label>
                  <InputField
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    placeholder="Admin"
                  />
                </div>

                <div>
                  <Label>Kategori</Label>
                  {!showCategoryInput ? (
                    <div className="flex gap-2">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Pilih kategori...</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCategoryInput(true)}
                        title="Buat kategori baru"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                        placeholder="Nama kategori baru..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCategoryInput(false)}
                      >
                        Batal
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Tags (pisahkan dengan koma)</Label>
                  <InputField
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="mesin es, perawatan, tips"
                  />
                </div>
              </div>

              <div>
                <Label>Ringkasan</Label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleChange("excerpt", e.target.value)}
                  rows={3}
                  maxLength={300}
                  required
                  placeholder="Ringkasan artikel (maks 300 karakter)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.excerpt.length}/300 karakter
                </p>
              </div>

              <div>
                <Label>Konten</Label>
                <div className="min-h-[300px]">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(value) => handleChange("content", value)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Tulis konten artikel di sini..."
                  />
                </div>
              </div>

              <div>
                <ImageUploadSingle
                  image={formData.coverImage}
                  onChange={(url) => handleChange("coverImage", url)}
                  label="Cover Image"
                  required
                  path={`articles/${formData.slug || "draft"}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tanggal Publikasi</Label>
                  <input
                    type="datetime-local"
                    name="publishedAt"
                    value={formData.publishedAt}
                    onChange={(e) => handleChange("publishedAt", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={(e) => handleChange("isPublished", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        {formData.isPublished ? "Dipublikasikan" : "Draft"}
                      </span>
                      <p className="text-xs text-gray-500">
                        {formData.isPublished ? "Artikel terlihat di halaman publik" : "Artikel tersimpan sebagai draft"}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Menyimpan..." : editingId ? "Update Artikel" : "Simpan Artikel"}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm}>
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daftar Artikel ({articles.length})</h3>
          {articles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada artikel. Tambahkan artikel pertama Anda!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Judul</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Kategori</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Tanggal</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-medium text-gray-900">{article.title}</div>
                        <div className="text-xs text-gray-500">{article.slug}</div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {article.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-sm">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="py-3 px-2">
                        {article.isPublished ? (
                          <Badge className="bg-green-100 text-green-800">Published</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditForm(article)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(article.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
