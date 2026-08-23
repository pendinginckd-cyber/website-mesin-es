"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Check, X, Edit2, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Star as StarIcon, Shield as ShieldIcon, Wrench as WrenchIcon, DollarSign as DollarSignIcon, Truck as TruckIcon, Headphones as HeadphonesIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { ImageUploadSingle } from "@/components/ui/image-upload-single";
import {
  getKeunggulanSettings,
  updateKeunggulanSettings,
  getKeunggulanItems,
  createKeunggulanItem,
  updateKeunggulanItem,
  deleteKeunggulanItem,
} from "@/lib/firestore/keunggulan";
import { KeunggulanSettings, KeunggulanItem } from "@/types/keunggulan";
import { Button } from "@/components/ui/button";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

const ICON_OPTIONS = [
  { value: "star", label: "Star" },
  { value: "shield", label: "Shield" },
  { value: "wrench", label: "Wrench" },
  { value: "dollar-sign", label: "Dollar Sign" },
  { value: "truck", label: "Truck" },
  { value: "headphones", label: "Headphones" },
];

export default function KeunggulanAdmin() {
  const [settings, setSettings] = useState<KeunggulanSettings | null>(null);
  const [items, setItems] = useState<KeunggulanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    icon: "shield",
    description: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [settingsData, itemsData] = await Promise.all([
      getKeunggulanSettings(),
      getKeunggulanItems(),
    ]);
    setSettings(settingsData);
    setItems(itemsData.filter((i) => i.isActive));
    setForm({
      title: settingsData?.title || "",
      subtitle: settingsData?.subtitle || "",
      icon: settingsData?.icon || "shield",
      description: "",
      order: 0,
      isActive: true,
    });
    setLoading(false);
  }

  function handleContentChange(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSettingsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateKeunggulanSettings(form);
      alert("Setting keunggulan berhasil diupdate!");
      fetchData();
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Gagal menyimpan setting. Silakan coba lagi.");
    }
    setSaving(false);
  }

  async function handleAddItem() {
    if (!form.title || !form.description) return;
    try {
      const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) : 0;
      await createKeunggulanItem({
        ...form,
        order: maxOrder + 1,
        isActive: true,
      });
      setForm({ title: "", subtitle: "", icon: "shield", description: "", order: 0, isActive: true });
      fetchData();
    } catch (error) {
      console.error("Error creating item:", error);
      alert("Gagal menambahkan item.");
    }
  }

  async function handleUpdateItem(id: string) {
    if (!form.title || !form.description) return;
    try {
      await updateKeunggulanItem(id, form);
      setEditingId(null);
      setForm({ title: "", subtitle: "", icon: "shield", description: "", order: 0, isActive: true });
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Gagal mengupdate item.");
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm("Hapus item keunggulan ini?")) return;
    try {
      await deleteKeunggulanItem(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Gagal menghapus item.");
    }
  }

  async function handleMoveItem(index: number, direction: "up" | "down") {
    const allSorted = [...items].sort((a, b) => a.order - b.order);
    const item = items[index];
    const currentIndex = allSorted.findIndex((g) => g.id === item.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= allSorted.length) return;
    const other = allSorted[newIndex];
    try {
      await Promise.all([
        updateKeunggulanItem(item.id, { order: other.order }),
        updateKeunggulanItem(other.id, { order: item.order }),
      ]);
      fetchData();
    } catch (error) {
      console.error("Error moving item:", error);
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
        <h2 className="text-2xl font-bold text-gray-900">Pengaturan Keunggulan</h2>
      </div>

      {/* Settings Section */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <StarIcon className="w-4 h-4 text-primary" />
            Judul & Subtitle
          </h3>

          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div>
              <Label>Judul Section</Label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="Kenapa Pilih Mesin Es Kristal Kami?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <Label>Subtitle</Label>
              <textarea
                value={form.subtitle}
                onChange={(e) => handleContentChange("subtitle", e.target.value)}
                rows={3}
                placeholder="Kami memberikan yang terbaik untuk setiap pelanggan dengan kualitas produk dan layanan purna jual yang terjamin."
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

      {/* Items Section */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TruckIcon className="w-4 h-4 text-primary" />
              Item Keunggulan
            </h3>
            {!adding && editingId === null && (
              <Button variant="outline" size="sm" onClick={() => { setAdding(true); setForm({ title: "", subtitle: "", icon: "shield", description: "", order: 0, isActive: true }); }}>
                <Plus className="w-4 h-4 mr-1" /> Tambah
              </Button>
            )}
          </div>

          {adding && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Icon</Label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Judul</Label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Kapasitas Riil"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <Label>Deskripsi</Label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    placeholder="Kapasitas produksi sesuai spesifikasi..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddItem}>
                  <Check className="w-4 h-4 mr-1" /> Simpan
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setAdding(false); setForm({ title: "", subtitle: "", icon: "shield", description: "", order: 0, isActive: true }); }}>
                  <X className="w-4 h-4 mr-1" /> Batal
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <div className="flex-1">
                  {editingId === item.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                      <input
                        type="text"
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                      <select
                        value={form.icon}
                        onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="star">Star</option>
                        <option value="shield">Shield</option>
                        <option value="wrench">Wrench</option>
                        <option value="dollar-sign">Dollar Sign</option>
                        <option value="truck">Truck</option>
                        <option value="headphones">Headphones</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className={`w-6 h-6 rounded-lg ${item.icon === "star" ? "bg-primary/10 text-primary" : item.icon === "shield" ? "bg-blue-50 text-blue-500" : ""} flex items-center justify-center text-xs font-medium`}>
                        {item.icon === "star" ? <StarIcon className="w-3 h-3" /> : item.icon === "shield" ? <ShieldIcon className="w-3 h-3" /> : item.icon === "wrench" ? <WrenchIcon className="w-3 h-3" /> : item.icon === "dollar-sign" ? <DollarSignIcon className="w-3 h-3" /> : item.icon === "truck" ? <TruckIcon className="w-3 h-3" /> : <HeadphonesIcon className="w-3 h-3" />}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-1">
                    {editingId === item.id ? (
                      <>
                        <Button size="sm" onClick={() => handleUpdateItem(item.id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setForm({ title: "", subtitle: "", icon: "shield", description: "", order: 0, isActive: true }); }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => { setEditingId(item.id); setForm({ title: item.title, subtitle: item.subtitle ?? "", icon: item.icon, description: item.description, order: item.order, isActive: item.isActive }); }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleMoveItem(index, "up")}
                          disabled={index === 0}
                          className="p-1.5 bg-white rounded shadow text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveItem(index, "down")}
                          disabled={index === items.length - 1}
                          className="p-1.5 bg-white rounded shadow text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && !adding && (
              <p className="text-sm text-gray-500 text-center py-4">Belum ada item keunggulan. Klik "Tambah" untuk menambahkan.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}