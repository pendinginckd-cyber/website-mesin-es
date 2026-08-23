"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploadSingle } from "@/components/ui/image-upload-single";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/firestore/testimonials";
import { Testimonial } from "@/types/testimonial";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Star,
  MessageSquare,
} from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="p-0.5"
        >
          <Star
            className={`w-6 h-6 ${
              i <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function extractYouTubeId(url: string): string {
  if (!url) return "";
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return "";
}

export default function TestimoniAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "featured">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerTitle: "",
    location: "",
    content: "",
    rating: 5,
    photo: "",
    videoUrl: "",
    productUsed: "",
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
    setLoading(false);
  }

  function resetForm() {
    setForm({ customerName: "", customerTitle: "", location: "", content: "", rating: 5, photo: "", videoUrl: "", productUsed: "", isActive: true, isFeatured: false });
    setEditingId(null);
    setAdding(false);
  }

  function startEdit(item: Testimonial) {
    setEditingId(item.id);
    setAdding(false);
    setForm({
      customerName: item.customerName,
      customerTitle: item.customerTitle || "",
      location: item.location || "",
      content: item.content,
      rating: item.rating,
      photo: item.photo || "",
      videoUrl: item.videoUrl || "",
      productUsed: item.productUsed || "",
      isActive: item.isActive,
      isFeatured: item.isFeatured,
    });
  }

  function startAdd() {
    setAdding(true);
    setEditingId(null);
    setForm({ customerName: "", customerTitle: "", location: "", content: "", rating: 5, photo: "", videoUrl: "", productUsed: "", isActive: true, isFeatured: false });
  }

  async function handleSave() {
    if (!form.customerName || !form.content) return;
    try {
      const data: Record<string, unknown> = {
        customerName: form.customerName,
        content: form.content,
        rating: form.rating,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
      };
      if (form.customerTitle) data.customerTitle = form.customerTitle;
      if (form.location) data.location = form.location;
      if (form.photo) data.photo = form.photo;
      if (form.productUsed) data.productUsed = form.productUsed;
      if (form.videoUrl) {
        const ytId = extractYouTubeId(form.videoUrl);
        if (ytId) data.videoUrl = ytId;
      }
      if (editingId) {
        await updateTestimonial(editingId, data);
      } else {
        await createTestimonial(data as Omit<Testimonial, "id" | "createdAt">);
      }
      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Gagal menyimpan.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus testimoni ini?")) return;
    try {
      await deleteTestimonial(id);
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Gagal menghapus.");
    }
  }

  async function toggleActive(item: Testimonial) {
    try {
      await updateTestimonial(item.id, { isActive: !item.isActive });
      fetchTestimonials();
    } catch (error) {
      console.error("Error toggling active:", error);
    }
  }

  async function toggleFeatured(item: Testimonial) {
    try {
      await updateTestimonial(item.id, { isFeatured: !item.isFeatured });
      fetchTestimonials();
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  }

  function getFiltered() {
    if (filter === "active") return testimonials.filter((t) => t.isActive);
    if (filter === "featured") return testimonials.filter((t) => t.isFeatured);
    return testimonials;
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
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Testimoni</h2>
        {!adding && !editingId && (
          <Button variant="primary" size="sm" onClick={startAdd}>
            <Plus className="w-4 h-4 mr-1" /> Tambah Testimoni
          </Button>
        )}
      </div>

      {/* Form */}
      {(adding || editingId) && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? "Edit Testimoni" : "Tambah Testimoni Baru"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nama Pelanggan</Label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Pak Budi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <Label>Jabatan / Usaha (opsional)</Label>
                  <input
                    type="text"
                    value={form.customerTitle}
                    onChange={(e) => setForm((prev) => ({ ...prev, customerTitle: e.target.value }))}
                    placeholder="Pemilik Toko Ikan Segar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Lokasi (opsional)</Label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Jakarta"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <Label>Produk yang Digunakan (opsional)</Label>
                  <input
                    type="text"
                    value={form.productUsed}
                    onChange={(e) => setForm((prev) => ({ ...prev, productUsed: e.target.value }))}
                    placeholder="Mesin Es 1 Ton/Hari"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <Label>Isi Testimoni</Label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  placeholder="Mesin ini sangat membantu bisnis saya..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">{form.content.length} karakter</p>
              </div>
              <div>
                <Label>Rating</Label>
                <StarRating value={form.rating} onChange={(v) => setForm((prev) => ({ ...prev, rating: v }))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ImageUploadSingle
                    image={form.photo}
                    onChange={(url) => setForm((prev) => ({ ...prev, photo: url }))}
                    label="Foto Pelanggan (opsional)"
                    path="testimonials"
                  />
                </div>
                <div>
                  <Label>YouTube URL Video Testimoni (opsional)</Label>
                  <input
                    type="text"
                    value={form.videoUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  {form.videoUrl && extractYouTubeId(form.videoUrl) && (
                    <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={`https://img.youtube.com/vi/${extractYouTubeId(form.videoUrl)}/maxresdefault.jpg`}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6">
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form.isFeatured ? "bg-yellow-500" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.isFeatured ? "translate-x-5" : ""}`} />
                  </button>
                  <span className="text-sm text-gray-700">Featured (tampil di homepage)</span>
                </div>
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

      {/* Filter */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            filter === "all"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          Semua ({testimonials.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            filter === "active"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          Aktif ({testimonials.filter((t) => t.isActive).length})
        </button>
        <button
          onClick={() => setFilter("featured")}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            filter === "featured"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          Featured ({testimonials.filter((t) => t.isFeatured).length})
        </button>
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div key={item.id} className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
              <div className="shrink-0">
                {item.photo ? (
                  <img
                    src={item.photo}
                    alt={item.customerName}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {item.customerName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{item.customerName}</span>
                  {item.customerTitle && (
                    <span className="text-sm text-gray-500">- {item.customerTitle}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {item.location && (
                    <span className="text-xs text-gray-500">{item.location}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 italic">
                  &ldquo;{item.content}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                  {item.isFeatured && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                      Featured
                    </span>
                  )}
                  {item.productUsed && (
                    <span className="text-xs text-gray-500">Produk: {item.productUsed}</span>
                  )}
                  {item.videoUrl && (
                    <span className="text-xs text-gray-500">Video: {item.videoUrl}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(item)}
                  className={`px-2 py-1 text-xs rounded-full font-medium ${item.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
                >
                  {item.isActive ? "ON" : "OFF"}
                </button>
                <button
                  onClick={() => toggleFeatured(item)}
                  className={`px-2 py-1 text-xs rounded-full font-medium ${item.isFeatured ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-700"}`}
                >
                  {item.isFeatured ? "★ Featured" : "☆ Featured"}
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
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Belum ada testimoni{filter !== "all" ? ` untuk filter "${filter}"` : ""}.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={startAdd}>
            <Plus className="w-4 h-4 mr-1" /> Tambah Testimoni
          </Button>
        </div>
      )}
    </div>
  );
}
