"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2,
  X,
  Settings,
} from "lucide-react";
import {
  getSpareparts,
  createSparepart,
  updateSparepart,
  deleteSparepart,
} from "@/lib/firestore/spareparts";
import {
  getSparepartSettings,
  addSparepartCategory,
  removeSparepartCategory,
} from "@/lib/firestore/sparepart-settings";
import { Sparepart } from "@/types/sparepart";

interface SparepartFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  priceDisplay: string;
  category: string;
  stock: string;
  isActive: boolean;
  images: string[];
  thumbnail: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoNoIndex: boolean;
  seoCanonical: string;
}

const initialFormData: SparepartFormData = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  price: 0,
  priceDisplay: "",
  category: "",
  stock: "tersedia",
  isActive: true,
  images: [],
  thumbnail: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  seoNoIndex: false,
  seoCanonical: "",
};

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

function InputField({ value, onChange, required, type = "text", placeholder, name }: {
  value: string | number;
  onChange: (name: string, value: string | number | boolean) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  name: string;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(name, type === "number" ? Number(e.target.value) : e.target.value)}
      required={required}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
    />
  );
}

function TextareaField({ value, onChange, required, rows, maxLength, name, placeholder }: {
  value: string;
  onChange: (name: string, value: string) => void;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  name: string;
  placeholder?: string;
}) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      rows={rows}
      maxLength={maxLength}
      required={required}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
    />
  );
}

export default function SparepartAdmin() {
  const [spareparts, setSpareparts] = useState<Sparepart[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SparepartFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [sparepartsData, settings] = await Promise.all([
        getSpareparts(),
        getSparepartSettings(),
      ]);
      setSpareparts(sparepartsData);
      setCategories(settings.categories || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }

  function handleChange(name: string, value: string | number | boolean) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(index: number, value: string) {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages[index] = value;
      while (newImages.length < 3) newImages.push("");
      return { ...prev, images: newImages };
    });
  }

  function addImageField() {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  }

  function openNewForm() {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(true);
    setShowSeo(false);
  }

  function openEditForm(sparepart: Sparepart) {
    setFormData({
      name: sparepart.name || "",
      slug: sparepart.slug || "",
      description: sparepart.description || "",
      shortDescription: sparepart.shortDescription || "",
      price: sparepart.price || 0,
      priceDisplay: sparepart.price ? `Rp ${sparepart.price.toLocaleString("id-ID")}` : "",
      category: sparepart.category || "",
      stock: sparepart.stock || "tersedia",
      isActive: sparepart.isActive ?? true,
      images: sparepart.images?.length ? sparepart.images : [],
      thumbnail: sparepart.thumbnail || "",
      seoTitle: sparepart.seoTitle || "",
      seoDescription: sparepart.seoDescription || "",
      seoKeywords: (sparepart.seoKeywords || []).join(", "),
      seoNoIndex: sparepart.seoNoIndex || false,
      seoCanonical: sparepart.seoCanonical || "",
    });
    setEditingId(sparepart.id);
    setShowForm(true);
    setShowSeo(false);
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
      const thumbnailFromGallery = formData.images[0] || "";

      const submitData: Omit<Sparepart, "id" | "createdAt" | "updatedAt"> = {
        ...formData,
        thumbnail: thumbnailFromGallery,
        seoKeywords: formData.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean),
      } as Omit<Sparepart, "id" | "createdAt" | "updatedAt">;

      if (editingId) {
        await updateSparepart(editingId, submitData);
        alert("Sparepart berhasil diupdate!");
      } else {
        await createSparepart(submitData);
        alert("Sparepart berhasil ditambahkan!");
      }

      closeForm();
      fetchData();
    } catch (error) {
      console.error("Error saving sparepart:", error);
      alert("Gagal menyimpan sparepart. Silakan coba lagi.");
    }

    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus sparepart ini?")) return;

    try {
      await deleteSparepart(id);
      alert("Sparepart berhasil dihapus!");
      fetchData();
    } catch (error) {
      console.error("Error deleting sparepart:", error);
      alert("Gagal menghapus sparepart.");
    }
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    if (categories.some((c) => c.toLowerCase() === newCategory.trim().toLowerCase())) {
      alert("Kategori sudah ada!");
      return;
    }
    setCategoryLoading(true);
    try {
      await addSparepartCategory(newCategory.trim());
      setNewCategory("");
      fetchData();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Gagal menambah kategori.");
    }
    setCategoryLoading(false);
  }

  async function handleRemoveCategory(category: string) {
    if (!confirm(`Hapus kategori "${category}"? Sparepart yang menggunakan kategori ini tidak akan terpengaruh.`)) return;
    setCategoryLoading(true);
    try {
      await removeSparepartCategory(category);
      fetchData();
    } catch (error) {
      console.error("Error removing category:", error);
      alert("Gagal menghapus kategori.");
    }
    setCategoryLoading(false);
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
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Sparepart</h2>
        <Button variant="primary" onClick={openNewForm}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Sparepart
        </Button>
      </div>

      {/* Category Manager */}
      <Card>
        <div className="p-6">
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Kelola Kategori</h3>
            </div>
            {showCategoryManager ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showCategoryManager && (
            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="Nama kategori baru..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddCategory}
                  disabled={categoryLoading || !newCategory.trim()}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah
                </Button>
              </div>

              {categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full"
                    >
                      <span className="text-sm text-blue-800">{cat}</span>
                      <button
                        onClick={() => handleRemoveCategory(cat)}
                        className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
                        title="Hapus kategori"
                      >
                        <X className="w-3 h-3 text-blue-600" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Belum ada kategori. Tambahkan kategori baru di atas.</p>
              )}
            </div>
          )}
        </div>
      </Card>

      {showForm && (
        <Card className="max-w-4xl">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Sparepart" : "Tambah Sparepart Baru"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nama Sparepart</Label>
                  <InputField name="name" value={formData.name} onChange={handleChange} required placeholder="Cooling Tower Fan Blade" />
                </div>
                <div>
                  <Label>Slug</Label>
                  <InputField name="slug" value={formData.slug} onChange={handleChange} required placeholder="cooling-tower-fan-blade" />
                </div>
                <div>
                  <Label>Harga (angka)</Label>
                  <InputField name="price" value={formData.price} onChange={handleChange} required type="number" />
                </div>
                <div>
                  <Label>Kategori</Label>
                  <div className="flex gap-2">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Pilih kategori</option>
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
                      onClick={() => setShowCategoryManager(true)}
                      title="Kelola kategori"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Stok</Label>
                  <select
                    name="stock"
                    value={formData.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="tersedia">Tersedia</option>
                    <option value="indent">Indent</option>
                    <option value="habis">Habis</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Deskripsi</Label>
                <TextareaField name="description" value={formData.description} onChange={handleChange} required rows={3} />
              </div>

              <div>
                <Label>Deskripsi Singkat (max 150)</Label>
                <TextareaField name="shortDescription" value={formData.shortDescription} onChange={handleChange} required rows={2} maxLength={150} />
              </div>

              <div>
                <ImageUpload
                  images={formData.images}
                  onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
                  maxImages={8}
                  productSlug={formData.slug || "sparepart"}
                  label="Gambar Sparepart"
                  required
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={(e) => handleChange("isActive", e.target.checked)} className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">Aktif</span>
                </label>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button type="button" onClick={() => setShowSeo(!showSeo)} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                  <span className="font-medium text-gray-900">Pengaturan SEO (Opsional)</span>
                  {showSeo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {showSeo && (
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-500">Kosongkan field di bawah untuk menggunakan nilai otomatis dari data sparepart.</p>
                    <div>
                      <Label>SEO Title (max 60 karakter)</Label>
                      <InputField name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="Kosongkan untuk pakai nama sparepart" />
                    </div>
                    <div>
                      <Label>SEO Description (max 160 karakter)</Label>
                      <TextareaField name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={2} maxLength={160} placeholder="Kosongkan untuk pakai deskripsi singkat" />
                    </div>
                    <div>
                      <Label>Keywords (pisahkan dengan koma)</Label>
                      <InputField name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} placeholder="sparepart, cooling tower, fan blade" />
                    </div>
                    <div>
                      <Label>Canonical URL</Label>
                      <InputField name="seoCanonical" value={formData.seoCanonical} onChange={handleChange} placeholder="https://mesineskristal.com/sparepart/slug" />
                    </div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="seoNoIndex" checked={formData.seoNoIndex} onChange={(e) => handleChange("seoNoIndex", e.target.checked)} className="w-4 h-4 text-primary rounded" />
                      <span className="text-sm">Sembunyikan dari Google (No Index)</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Menyimpan..." : editingId ? "Update Sparepart" : "Simpan Sparepart"}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daftar Sparepart ({spareparts.length})</h3>
          {spareparts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada sparepart. Tambahkan sparepart pertama Anda!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Nama</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Kategori</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Harga</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Stok</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {spareparts.map((sparepart) => (
                    <tr key={sparepart.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-medium text-gray-900">{sparepart.name}</div>
                        <div className="text-xs text-gray-500">{sparepart.slug}</div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {sparepart.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-sm">Rp {sparepart.price.toLocaleString("id-ID")}</td>
                      <td className="py-3 px-2">
                        <Badge className={sparepart.stock === "tersedia" ? "bg-green-100 text-green-800" : sparepart.stock === "indent" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                          {sparepart.stock}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        {sparepart.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Nonaktif</Badge>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditForm(sparepart)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(sparepart.id)} className="text-red-500 hover:text-red-700">
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
