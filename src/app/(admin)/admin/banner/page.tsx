"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploadSingle } from "@/components/ui/image-upload-single";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/lib/firestore/banners";
import { Banner } from "@/types/banner";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Megaphone,
} from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return "";
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
}

function parseDate(value: string): Date | undefined {
  if (!value) return undefined;
  return new Date(value);
}

export default function BannerAdmin() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    linkUrl: "",
    order: 0,
    isActive: true,
    startDate: formatDate(new Date()),
    endDate: "",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
    setLoading(false);
  }

  function resetForm() {
    setForm({ title: "", imageUrl: "", linkUrl: "", order: 0, isActive: true, startDate: formatDate(new Date()), endDate: "" });
    setEditingId(null);
    setAdding(false);
  }

  function startEdit(item: Banner) {
    setEditingId(item.id);
    setAdding(false);
    setForm({
      title: item.title,
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl || "",
      order: item.order,
      isActive: item.isActive,
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
    });
  }

  function startAdd() {
    setAdding(true);
    setEditingId(null);
    const maxOrder = banners.length > 0 ? Math.max(...banners.map((b) => b.order)) : 0;
    setForm({ title: "", imageUrl: "", linkUrl: "", order: maxOrder + 1, isActive: true, startDate: formatDate(new Date()), endDate: "" });
  }

  async function handleSave() {
    if (!form.title || !form.imageUrl) return;
    try {
      const data: Record<string, unknown> = {
        title: form.title,
        imageUrl: form.imageUrl,
        order: form.order,
        isActive: form.isActive,
        startDate: parseDate(form.startDate) || new Date(),
      };
      if (form.linkUrl) data.linkUrl = form.linkUrl;
      if (form.endDate) data.endDate = parseDate(form.endDate);
      if (editingId) {
        await updateBanner(editingId, data);
      } else {
        await createBanner(data as Omit<Banner, "id">);
      }
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Gagal menyimpan.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus banner ini?")) return;
    try {
      await deleteBanner(id);
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Gagal menghapus.");
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const sorted = [...banners].sort((a, b) => a.order - b.order);
    const item = sorted[index];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sorted.length) return;
    const other = sorted[newIndex];
    try {
      await Promise.all([
        updateBanner(item.id, { order: other.order }),
        updateBanner(other.id, { order: item.order }),
      ]);
      fetchBanners();
    } catch (error) {
      console.error("Error moving banner:", error);
    }
  }

  async function toggleActive(item: Banner) {
    try {
      await updateBanner(item.id, { isActive: !item.isActive });
      fetchBanners();
    } catch (error) {
      console.error("Error toggling active:", error);
    }
  }

  const sorted = [...banners].sort((a, b) => a.order - b.order);

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
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Banner</h2>
        {!adding && !editingId && (
          <Button variant="primary" size="sm" onClick={startAdd}>
            <Plus className="w-4 h-4 mr-1" /> Tambah Banner
          </Button>
        )}
      </div>

      {/* Form */}
      {(adding || editingId) && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? "Edit Banner" : "Tambah Banner Baru"}
            </h3>
            <div className="space-y-4">
              <ImageUploadSingle
                image={form.imageUrl}
                onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                label="Gambar Banner"
                required
                path="banners"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Judul Banner</Label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Promo Spesial Mesin Es"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <Label>Link URL (opsional)</Label>
                  <input
                    type="text"
                    value={form.linkUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, linkUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Tanggal Mulai</Label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <Label>Tanggal Berakhir (opsional)</Label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <Label>Urutan</Label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? "bg-primary" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.isActive ? "translate-x-5" : ""}`} />
                </button>
                <span className="text-sm text-gray-700">Aktif</span>
              </div>
              <div className="flex gap-3 pt-2">
                <Button size="sm" onClick={handleSave}>
                  <Check className="w-4 h-4 mr-1" /> Simpan
                </Button>
                <Button size="sm" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-1" /> Batal
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* List */}
      {sorted.length > 0 ? (
        <div className="space-y-4">
          {sorted.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col gap-1 shrink-0 pt-8">
                <button
                  type="button"
                  onClick={() => handleMove(index, "up")}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, "down")}
                  disabled={index === sorted.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <div className="w-48 aspect-video rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                {item.linkUrl && (
                  <p className="text-sm text-gray-500 truncate">{item.linkUrl}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {item.startDate ? formatDate(item.startDate) : "-"} s/d {item.endDate ? formatDate(item.endDate) : "Tidak berakhir"}
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(item)}
                  className={`px-2 py-1 text-xs rounded-full font-medium ${item.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
                >
                  {item.isActive ? "ON" : "OFF"}
                </button>
                <button
                  onClick={() => startEdit(item)}
                  className="p-1.5 text-gray-400 hover:text-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Belum ada banner.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={startAdd}>
            <Plus className="w-4 h-4 mr-1" /> Tambah Banner
          </Button>
        </div>
      )}
    </div>
  );
}
