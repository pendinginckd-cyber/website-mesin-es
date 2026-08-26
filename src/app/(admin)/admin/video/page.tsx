"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { getVideos, createVideo, updateVideo, deleteVideo } from "@/lib/firestore/videos";
import { Video } from "@/types/video";
import { VIDEO_CATEGORIES } from "@/lib/constants";
import { extractYouTubeId, getYouTubeThumbnail } from "@/utils/youtube";

interface VideoFormData {
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  description: string;
  category: string;
  isFeatured: boolean;
  isActive: boolean;
  publishedAt: string;
}

const initialFormData: VideoFormData = {
  title: "",
  youtubeUrl: "",
  youtubeId: "",
  description: "",
  category: "demo",
  isFeatured: false,
  isActive: true,
  publishedAt: new Date().toISOString().slice(0, 16),
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

export default function VideoAdmin() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<VideoFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    try {
      const data = await getVideos();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
    setLoading(false);
  }

  function handleChange(name: string, value: string | number | boolean) {
    if (name === "youtubeUrl" && typeof value === "string") {
      // Efek samping di luar updater agar tetap pure (aman StrictMode)
      setThumbnailError(false);
      const youtubeId = extractYouTubeId(value);
      setFormData((prev) => ({ ...prev, youtubeUrl: value, youtubeId }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function openNewForm() {
    setFormData({
      ...initialFormData,
      publishedAt: new Date().toISOString().slice(0, 16),
    });
    setEditingId(null);
    setShowForm(true);
    setThumbnailError(false);
  }

  function openEditForm(video: Video) {
    setFormData({
      title: video.title || "",
      youtubeUrl: video.youtubeId || "",
      youtubeId: video.youtubeId || "",
      description: video.description || "",
      category: video.category || "demo",
      isFeatured: video.isFeatured ?? false,
      isActive: video.isActive ?? true,
      publishedAt: video.publishedAt
        ? new Date(video.publishedAt).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
    });
    setEditingId(video.id);
    setShowForm(true);
    setThumbnailError(false);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormData);
    setThumbnailError(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.youtubeId) {
      alert("URL YouTube tidak valid. Pastikan URL YouTube benar.");
      return;
    }

    setSaving(true);

    try {
      const submitData = {
        title: formData.title,
        youtubeId: formData.youtubeId,
        description: formData.description,
        thumbnail: getYouTubeThumbnail(formData.youtubeId),
        category: formData.category,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        publishedAt: new Date(formData.publishedAt),
        order: 0,
      };

      if (editingId) {
        await updateVideo(editingId, submitData);
        alert("Video berhasil diupdate!");
      } else {
        await createVideo(submitData);
        alert("Video berhasil ditambahkan!");
      }

      closeForm();
      fetchVideos();
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Gagal menyimpan video. Silakan coba lagi.");
    }

    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus video ini?")) return;

    try {
      await deleteVideo(id);
      alert("Video berhasil dihapus!");
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Gagal menghapus video.");
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
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Video</h2>
        <Button variant="primary" onClick={openNewForm}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Video
        </Button>
      </div>

      {showForm && (
        <Card className="max-w-4xl">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Video" : "Tambah Video Baru"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Judul Video</Label>
                  <InputField
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Demo Mesin Es Kristal 1 Ton"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>URL YouTube</Label>
                  <InputField
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Support: youtube.com/watch, youtu.be, youtube.com/embed, youtube.com/shorts
                  </p>
                </div>

                <div>
                  <Label>Kategori</Label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {VIDEO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

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
              </div>

              <div>
                <Label>Deskripsi</Label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  required
                  placeholder="Deskripsi video..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {formData.youtubeId && (
                <div>
                  <Label>Preview Thumbnail</Label>
                  <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                    <img
                      src={getYouTubeThumbnail(formData.youtubeId)}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                      onError={() => setThumbnailError(true)}
                    />
                    {thumbnailError && (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Thumbnail tidak tersedia
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    YouTube ID: <code className="bg-gray-100 px-1 rounded">{formData.youtubeId}</code>
                  </p>
                </div>
              )}

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => handleChange("isFeatured", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Video Unggulan
                    </span>
                    <p className="text-xs text-gray-500">
                      Ditampilkan di hero section halaman video
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleChange("isActive", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {formData.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                    <p className="text-xs text-gray-500">
                      {formData.isActive ? "Video tampil di halaman publik" : "Video disembunyikan"}
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Menyimpan..." : editingId ? "Update Video" : "Simpan Video"}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daftar Video ({videos.length})</h3>
          {videos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada video. Tambahkan video pertama Anda!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Video</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Kategori</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Tanggal</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video) => (
                    <tr key={video.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-20 h-12 object-cover rounded"
                            onError={(e) => {
                              // Fallback ke thumbnail YouTube resmi (via.placeholder.com sudah mati)
                              const img = e.target as HTMLImageElement;
                              if (img.dataset.fallbackApplied) return;
                              img.dataset.fallbackApplied = "1";
                              img.src = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
                            }}
                          />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{video.title}</div>
                            <div className="text-xs text-gray-500">{video.youtubeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className="bg-blue-100 text-blue-800 capitalize">
                          {video.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-sm">
                        {video.publishedAt
                          ? new Date(video.publishedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex flex-col gap-1">
                          {video.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800 w-fit">Featured</Badge>
                          )}
                          {video.isActive ? (
                            <Badge className="bg-green-100 text-green-800 w-fit">Aktif</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 w-fit">Nonaktif</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditForm(video)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(video.id)} className="text-red-500 hover:text-red-700">
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
