"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploadSingle } from "@/components/ui/image-upload-single";
import {
  getGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
} from "@/lib/firestore/galleries";
import { Gallery } from "@/types/gallery";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
} from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

export default function GaleriAdmin() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    category: "workshop",
    description: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchGalleries();
  }, []);

  async function fetchGalleries() {
    setLoading(true);
    try {
      const data = await getGalleries();
      setGalleries(data);
    } catch (error) {
      console.error("Error fetching galleries:", error);
    }
    setLoading(false);
  }

  function resetForm() {
    setForm({ title: "", imageUrl: "", category: "workshop", description: "", order: 0, isActive: true });
    setEditingId(null);
    setAdding(false);
  }

  function startEdit(item: Gallery) {
    setEditingId(item.id);
    setAdding(false);
    setForm({
      title: item.title,
      imageUrl: item.imageUrl,
      category: item.category,
      description: item.description || "",
      order: item.order,
      isActive: item.isActive,
    });
  }

  function startAdd() {
    setAdding(true);
    setEditingId(null);
    const maxOrder = galleries.length > 0 ? Math.max(...galleries.map((g) => g.order)) : 0;
    setForm({ title: "", imageUrl: "", category: "workshop", description: "", order: maxOrder + 1, isActive: true });
  }

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.title || !form.imageUrl || saving) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateGallery(editingId, form);
      } else {
        await createGallery(form);
      }
      resetForm();
      fetchGalleries();
    } catch (error) {
      console.error("Error saving gallery:", error);
      alert("Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus gambar ini?")) return;
    try {
      await deleteGallery(id);
      fetchGalleries();
    } catch (error) {
      console.error("Error deleting gallery:", error);
      alert("Gagal menghapus.");
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const filtered = getFiltered();
    const item = filtered[index];
    const allSorted = [...galleries].sort((a, b) => a.order - b.order);
    const currentIndex = allSorted.findIndex((g) => g.id === item.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= allSorted.length) return;
    const other = allSorted[newIndex];
    try {
      await Promise.all([
        updateGallery(item.id, { order: other.order }),
        updateGallery(other.id, { order: item.order }),
      ]);
      fetchGalleries();
    } catch (error) {
      console.error("Error moving gallery:", error);
    }
  }

  async function toggleActive(item: Gallery) {
    try {
      await updateGallery(item.id, { isActive: !item.isActive });
      fetchGalleries();
    } catch (error) {
      console.error("Error toggling active:", error);
    }
  }

  function getFiltered() {
    if (filterCategory === "all") return [...galleries].sort((a, b) => a.order - b.order);
    return galleries.filter((g) => g.category === filterCategory).sort((a, b) => a.order - b.order);
  }

  const filtered = getFiltered();

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
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Galeri</h2>
        {!adding && !editingId && (
          <Button variant="primary" size="sm" onClick={startAdd}>
            <Plus className="w-4 h-4 mr-1" /> Tambah Gambar
          </Button>
        )}
      </div>

      {/* Form */}
      {(adding || editingId) && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? "Edit Gambar" : "Tambah Gambar Baru"}
            </h3>
            <div className="space-y-4">
              <ImageUploadSingle
                image={form.imageUrl}
                onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                label="Gambar"
                required
                path="galleries"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Judul</Label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Proses produksi mesin es"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <Label>Kategori</Label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label>Deskripsi (opsional)</Label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  placeholder="Keterangan singkat..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <Label>Urutan</Label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? "bg-primary" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.isActive ? "translate-x-5" : ""}`} />
                  </button>
                  <span className="text-sm text-gray-700">Aktif</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  <Check className="w-4 h-4 mr-1" /> {saving ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button size="sm" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-1" /> Batal
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilterCategory("all")}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            filterCategory === "all"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          Semua ({galleries.length})
        </button>
        {GALLERY_CATEGORIES.map((cat) => {
          const count = galleries.filter((g) => g.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                filterCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:border-primary"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, index) => (
            <div key={item.id} className="group relative">
              <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                    {item.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleMove(index, "up")}
                  disabled={index === 0}
                  className="p-1.5 bg-white rounded shadow text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(index, "down")}
                  disabled={index === filtered.length - 1}
                  className="p-1.5 bg-white rounded shadow text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => startEdit(item)}
                  className="p-1.5 bg-white rounded shadow text-gray-700 hover:bg-gray-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 bg-white rounded shadow text-red-500 hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-2 left-2">
                <button
                  onClick={() => toggleActive(item)}
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    item.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                  }`}
                >
                  {item.isActive ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Belum ada gambar{filterCategory !== "all" ? ` untuk kategori "${filterCategory}"` : ""}.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={startAdd}>
            <Plus className="w-4 h-4 mr-1" /> Tambah Gambar
          </Button>
        </div>
      )}
    </div>
  );
}
