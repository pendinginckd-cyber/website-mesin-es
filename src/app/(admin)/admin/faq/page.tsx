"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from "@/lib/firestore/faqs";
import { Faq } from "@/types/faq";
import { FAQ_CATEGORIES } from "@/lib/constants";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  HelpCircle,
} from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

export default function FaqAdmin() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "umum",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  async function fetchFaqs() {
    setLoading(true);
    try {
      const data = await getFaqs();
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching faqs:", error);
    }
    setLoading(false);
  }

  function resetForm() {
    setForm({ question: "", answer: "", category: "umum", order: 0, isActive: true });
    setEditingId(null);
    setAdding(false);
  }

  function startEdit(item: Faq) {
    setEditingId(item.id);
    setAdding(false);
    setForm({
      question: item.question,
      answer: item.answer,
      category: item.category,
      order: item.order,
      isActive: item.isActive,
    });
  }

  function startAdd() {
    setAdding(true);
    setEditingId(null);
    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.order)) : 0;
    setForm({ question: "", answer: "", category: "umum", order: maxOrder + 1, isActive: true });
  }

  async function handleSave() {
    if (!form.question || !form.answer) return;
    try {
      if (editingId) {
        await updateFaq(editingId, form);
      } else {
        await createFaq(form);
      }
      resetForm();
      fetchFaqs();
    } catch (error) {
      console.error("Error saving faq:", error);
      alert("Gagal menyimpan.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus FAQ ini?")) return;
    try {
      await deleteFaq(id);
      fetchFaqs();
    } catch (error) {
      console.error("Error deleting faq:", error);
      alert("Gagal menghapus.");
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const filtered = getFiltered();
    const item = filtered[index];
    const allSorted = [...faqs].sort((a, b) => a.order - b.order);
    const currentIndex = allSorted.findIndex((f) => f.id === item.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= allSorted.length) return;
    const other = allSorted[newIndex];
    try {
      await Promise.all([
        updateFaq(item.id, { order: other.order }),
        updateFaq(other.id, { order: item.order }),
      ]);
      fetchFaqs();
    } catch (error) {
      console.error("Error moving faq:", error);
    }
  }

  async function toggleActive(item: Faq) {
    try {
      await updateFaq(item.id, { isActive: !item.isActive });
      fetchFaqs();
    } catch (error) {
      console.error("Error toggling active:", error);
    }
  }

  function getFiltered() {
    if (filterCategory === "all") return [...faqs].sort((a, b) => a.order - b.order);
    return faqs.filter((f) => f.category === filterCategory).sort((a, b) => a.order - b.order);
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
        <h2 className="text-2xl font-bold text-gray-900">Manajemen FAQ</h2>
        {!adding && !editingId && (
          <Button variant="primary" size="sm" onClick={startAdd}>
            <Plus className="w-4 h-4 mr-1" /> Tambah FAQ
          </Button>
        )}
      </div>

      {/* Form */}
      {(adding || editingId) && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? "Edit FAQ" : "Tambah FAQ Baru"}
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Pertanyaan</Label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
                  placeholder="Apa itu mesin es kristal?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <Label>Jawaban</Label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
                  rows={5}
                  placeholder="Mesin es kristal adalah..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">{form.answer.length} karakter</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Kategori</Label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {FAQ_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
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
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilterCategory("all")}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            filterCategory === "all"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          Semua ({faqs.length})
        </button>
        {FAQ_CATEGORIES.map((cat) => {
          const count = faqs.filter((f) => f.category === cat).length;
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

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((item, index) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 shrink-0 pt-1">
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
                    disabled={index === filtered.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                      {item.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{item.question}</h4>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{item.answer}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => toggleActive(item)}
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      item.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                    }`}
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
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Belum ada FAQ{filterCategory !== "all" ? ` untuk kategori "${filterCategory}"` : ""}.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={startAdd}>
            <Plus className="w-4 h-4 mr-1" /> Tambah FAQ
          </Button>
        </div>
      )}
    </div>
  );
}
