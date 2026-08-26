"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploadSingle } from "@/components/ui/image-upload-single";
import {
  getAboutContent,
  updateAboutContent,
  getAboutStats,
  createAboutStat,
  updateAboutStat,
  deleteAboutStat,
  getAboutGallery,
  createAboutGalleryItem,
  updateAboutGalleryItem,
  deleteAboutGalleryItem,
} from "@/lib/firestore/about";
import { AboutStat, AboutGalleryItem } from "@/types/about";
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Star,
  FileText,
  Target,
  Power,
} from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

export default function TentangAdmin() {
  const [stats, setStats] = useState<AboutStat[]>([]);
  const [gallery, setGallery] = useState<AboutGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statSaving, setStatSaving] = useState(false);
  const [gallerySaving, setGallerySaving] = useState(false);
  const [formData, setFormData] = useState({
    heroImage: "",
    companyName: "",
    companyDescription: "",
    vision: "",
    mission: "",
  });
  const [editingStat, setEditingStat] = useState<string | null>(null);
  const [statForm, setStatForm] = useState({ label: "", value: "", icon: "star" });
  const [addingStat, setAddingStat] = useState(false);
  const [editingGallery, setEditingGallery] = useState<string | null>(null);
  const [galleryForm, setGalleryForm] = useState({ imageUrl: "", caption: "" });
  const [addingGallery, setAddingGallery] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [contentData, statsData, galleryData] = await Promise.all([
        getAboutContent(),
        getAboutStats(),
        getAboutGallery(),
      ]);
      // Tampilkan SEMUA item (aktif & nonaktif) agar tetap bisa dikelola
      setStats(statsData);
      setGallery(galleryData);
      setFormData({
        heroImage: contentData.heroImage || "",
        companyName: contentData.companyName || "",
        companyDescription: contentData.companyDescription || "",
        vision: contentData.vision || "",
        mission: contentData.mission || "",
      });
    } catch (error) {
      console.error("Error fetching tentang data:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleContentChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleContentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAboutContent(formData);
      alert("Konten Tentang berhasil diupdate!");
      fetchData();
    } catch (error) {
      console.error("Error saving about content:", error);
      alert("Gagal menyimpan konten. Silakan coba lagi.");
    }
    setSaving(false);
  }

  async function handleAddStat() {
    if (!statForm.label || !statForm.value || statSaving) return;
    setStatSaving(true);
    try {
      const maxOrder = stats.length > 0 ? Math.max(...stats.map((s) => s.order)) : 0;
      await createAboutStat({
        ...statForm,
        order: maxOrder + 1,
        isActive: true,
      });
      setStatForm({ label: "", value: "", icon: "star" });
      setAddingStat(false);
      await fetchData();
    } catch (error) {
      console.error("Error creating stat:", error);
      alert("Gagal menambahkan stat.");
    }
    setStatSaving(false);
  }

  async function handleUpdateStat(id: string) {
    if (!statForm.label || !statForm.value || statSaving) return;
    setStatSaving(true);
    try {
      await updateAboutStat(id, statForm);
      setEditingStat(null);
      setStatForm({ label: "", value: "", icon: "star" });
      await fetchData();
    } catch (error) {
      console.error("Error updating stat:", error);
      alert("Gagal mengupdate stat.");
    }
    setStatSaving(false);
  }

  async function handleToggleStat(id: string, isActive: boolean) {
    try {
      await updateAboutStat(id, { isActive: !isActive });
      await fetchData();
    } catch (error) {
      console.error("Error toggling stat:", error);
    }
  }

  async function handleDeleteStat(id: string) {
    if (!confirm("Hapus stat ini?")) return;
    try {
      await deleteAboutStat(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting stat:", error);
      alert("Gagal menghapus stat.");
    }
  }

  async function handleMoveStat(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= stats.length) return;
    const current = stats[index];
    const other = stats[newIndex];
    try {
      await Promise.all([
        updateAboutStat(current.id, { order: other.order }),
        updateAboutStat(other.id, { order: current.order }),
      ]);
      fetchData();
    } catch (error) {
      console.error("Error moving stat:", error);
    }
  }

  async function handleAddGalleryItem() {
    if (!galleryForm.imageUrl || gallerySaving) return;
    setGallerySaving(true);
    try {
      const maxOrder = gallery.length > 0 ? Math.max(...gallery.map((g) => g.order)) : 0;
      await createAboutGalleryItem({
        ...galleryForm,
        order: maxOrder + 1,
        isActive: true,
      });
      setGalleryForm({ imageUrl: "", caption: "" });
      setAddingGallery(false);
      await fetchData();
    } catch (error) {
      console.error("Error creating gallery item:", error);
      alert("Gagal menambahkan gambar.");
    }
    setGallerySaving(false);
  }

  async function handleUpdateGalleryItem(id: string) {
    if (!galleryForm.imageUrl || gallerySaving) return;
    setGallerySaving(true);
    try {
      await updateAboutGalleryItem(id, galleryForm);
      setEditingGallery(null);
      setGalleryForm({ imageUrl: "", caption: "" });
      await fetchData();
    } catch (error) {
      console.error("Error updating gallery item:", error);
      alert("Gagal mengupdate gambar.");
    }
    setGallerySaving(false);
  }

  async function handleToggleGalleryItem(id: string, isActive: boolean) {
    try {
      await updateAboutGalleryItem(id, { isActive: !isActive });
      await fetchData();
    } catch (error) {
      console.error("Error toggling gallery item:", error);
    }
  }

  async function handleDeleteGalleryItem(id: string) {
    if (!confirm("Hapus gambar ini?")) return;
    try {
      await deleteAboutGalleryItem(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      alert("Gagal menghapus gambar.");
    }
  }

  async function handleMoveGallery(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= gallery.length) return;
    const current = gallery[index];
    const other = gallery[newIndex];
    try {
      await Promise.all([
        updateAboutGalleryItem(current.id, { order: other.order }),
        updateAboutGalleryItem(other.id, { order: current.order }),
      ]);
      fetchData();
    } catch (error) {
      console.error("Error moving gallery item:", error);
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
        <h2 className="text-2xl font-bold text-gray-900">Kelola Halaman Tentang</h2>
      </div>

      {/* Content Section */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Konten Utama
          </h3>

          <form onSubmit={handleContentSubmit} className="space-y-6">
            <div>
              <ImageUploadSingle
                image={formData.heroImage}
                onChange={(url) => handleContentChange("heroImage", url)}
                label="Gambar Hero"
                path="about"
              />
            </div>

            <div>
              <Label>Nama Perusahaan</Label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={(e) => handleContentChange("companyName", e.target.value)}
                placeholder="PT Mesin Es Kristal Indonesia"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <Label>Deskripsi Perusahaan</Label>
              <textarea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={(e) => handleContentChange("companyDescription", e.target.value)}
                rows={4}
                placeholder="Ceritakan profil perusahaan, sejarah, dan pengalaman..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.companyDescription.length} karakter</p>
            </div>

            <div>
              <Label>Visi</Label>
              <textarea
                name="vision"
                value={formData.vision}
                onChange={(e) => handleContentChange("vision", e.target.value)}
                rows={3}
                placeholder="Visi perusahaan..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <Label>Misi</Label>
              <textarea
                name="mission"
                value={formData.mission}
                onChange={(e) => handleContentChange("mission", e.target.value)}
                rows={4}
                placeholder="Misi perusahaan (pisahkan dengan baris baru)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Stats Section */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Kenapa Memilih Kami (Stat)
            </h3>
            {!addingStat && (
              <Button variant="outline" size="sm" onClick={() => { setAddingStat(true); setStatForm({ label: "", value: "", icon: "star" }); }}>
                <Plus className="w-4 h-4 mr-1" /> Tambah Stat
              </Button>
            )}
          </div>

          {addingStat && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Label</Label>
                  <input
                    type="text"
                    value={statForm.label}
                    onChange={(e) => setStatForm((prev) => ({ ...prev, label: e.target.value }))}
                    placeholder="Tahun Pengalaman"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <Label>Nilai</Label>
                  <input
                    type="text"
                    value={statForm.value}
                    onChange={(e) => setStatForm((prev) => ({ ...prev, value: e.target.value }))}
                    placeholder="10+"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <Label>Icon</Label>
                  <select
                    value={statForm.icon}
                    onChange={(e) => setStatForm((prev) => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="star">Star</option>
                    <option value="award">Award</option>
                    <option value="users">Users</option>
                    <option value="package">Package</option>
                    <option value="shield">Shield</option>
                    <option value="zap">Zap</option>
                    <option value="heart">Heart</option>
                    <option value="check-circle">Check Circle</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddStat} disabled={statSaving}>
                  <Check className="w-4 h-4 mr-1" /> {statSaving ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setAddingStat(false); setStatForm({ label: "", value: "", icon: "star" }); }}>
                  <X className="w-4 h-4 mr-1" /> Batal
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div key={stat.id} className={`flex items-center gap-3 bg-gray-50 rounded-lg p-3 ${!stat.isActive ? "opacity-50" : ""}`}>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveStat(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveStat(index, "down")}
                    disabled={index === stats.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {editingStat === stat.id ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={statForm.label}
                      onChange={(e) => setStatForm((prev) => ({ ...prev, label: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <input
                      type="text"
                      value={statForm.value}
                      onChange={(e) => setStatForm((prev) => ({ ...prev, value: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <select
                      value={statForm.icon}
                      onChange={(e) => setStatForm((prev) => ({ ...prev, icon: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="star">Star</option>
                      <option value="award">Award</option>
                      <option value="users">Users</option>
                      <option value="package">Package</option>
                      <option value="shield">Shield</option>
                      <option value="zap">Zap</option>
                      <option value="heart">Heart</option>
                      <option value="check-circle">Check Circle</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center gap-4">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">{stat.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{stat.label}</p>
                      <p className="text-sm text-gray-500">{stat.value}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-1">
                  {editingStat === stat.id ? (
                    <>
                      <Button size="sm" onClick={() => handleUpdateStat(stat.id)} disabled={statSaving}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingStat(null); setStatForm({ label: "", value: "", icon: "star" }); }}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleToggleStat(stat.id, stat.isActive)}
                        className={`p-1.5 rounded-lg transition-colors ${stat.isActive ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                        title={stat.isActive ? "Nonaktifkan (sembunyikan dari website)" : "Aktifkan"}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingStat(stat.id); setAddingStat(false); setStatForm({ label: stat.label, value: stat.value, icon: stat.icon }); }}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteStat(stat.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {stats.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Belum ada stat. Klik &quot;Tambah Stat&quot; untuk menambahkan.</p>
            )}
          </div>
        </div>
      </Card>

      {/* Gallery Section */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Galeri Workshop
            </h3>
            {!addingGallery && (
              <Button variant="outline" size="sm" onClick={() => { setAddingGallery(true); setGalleryForm({ imageUrl: "", caption: "" }); }}>
                <Plus className="w-4 h-4 mr-1" /> Tambah Gambar
              </Button>
            )}
          </div>

          {addingGallery && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              <ImageUploadSingle
                image={galleryForm.imageUrl}
                onChange={(url) => setGalleryForm((prev) => ({ ...prev, imageUrl: url }))}
                label="Gambar"
                path="about-gallery"
              />
              <div>
                <Label>Caption</Label>
                <input
                  type="text"
                  value={galleryForm.caption}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, caption: e.target.value }))}
                  placeholder="Deskripsi singkat gambar..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddGalleryItem} disabled={gallerySaving}>
                  <Check className="w-4 h-4 mr-1" /> {gallerySaving ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setAddingGallery(false); setGalleryForm({ imageUrl: "", caption: "" }); }}>
                  <X className="w-4 h-4 mr-1" /> Batal
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((item, index) => (
              <div key={item.id} className={`relative group ${!item.isActive ? "opacity-50" : ""}`}>
                {editingGallery === item.id ? (
                  <div className="space-y-3 bg-gray-50 rounded-lg p-3">
                    <ImageUploadSingle
                      image={galleryForm.imageUrl}
                      onChange={(url) => setGalleryForm((prev) => ({ ...prev, imageUrl: url }))}
                      label="Gambar"
                      path="about-gallery"
                    />
                    <input
                      type="text"
                      value={galleryForm.caption}
                      onChange={(e) => setGalleryForm((prev) => ({ ...prev, caption: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdateGalleryItem(item.id)} disabled={gallerySaving}>
                        <Check className="w-4 h-4 mr-1" /> {gallerySaving ? "Menyimpan..." : "Simpan"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingGallery(null); setGalleryForm({ imageUrl: "", caption: "" }); }}>
                        <X className="w-4 h-4 mr-1" /> Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm text-gray-700 mt-1 truncate">{item.caption || "Tanpa caption"}</p>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleToggleGalleryItem(item.id, item.isActive)}
                        className={`p-1.5 bg-white rounded shadow transition-colors ${item.isActive ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                        title={item.isActive ? "Nonaktifkan (sembunyikan dari website)" : "Aktifkan"}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingGallery(item.id); setAddingGallery(false); setGalleryForm({ imageUrl: item.imageUrl, caption: item.caption }); }}
                        className="p-1.5 bg-white rounded shadow text-gray-700 hover:bg-gray-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="p-1.5 bg-white rounded shadow text-red-500 hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleMoveGallery(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 bg-white rounded shadow text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveGallery(index, "down")}
                        disabled={index === gallery.length - 1}
                        className="p-1.5 bg-white rounded shadow text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {gallery.length === 0 && !addingGallery && (
            <p className="text-sm text-gray-500 text-center py-4">Belum ada gambar. Klik &quot;Tambah Gambar&quot; untuk menambahkan.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
