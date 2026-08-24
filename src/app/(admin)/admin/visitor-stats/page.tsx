"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getVisitorStats,
  updateVisitorBase,
} from "@/lib/firestore/visitor-stats";
import { VisitorStats } from "@/types/visitor-stats";
import { Save, Eye, RotateCcw } from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

export default function VisitorStatsAdmin() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    baseDaily: 0,
    baseYearly: 0,
    baseTotal: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      const data = await getVisitorStats();
      setStats(data);
      setForm({
        baseDaily: data.baseDaily || 0,
        baseYearly: data.baseYearly || 0,
        baseTotal: data.baseTotal || 0,
      });
    } catch (error) {
      console.error("Error fetching visitor stats:", error);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateVisitorBase(form);
      alert("Nilai start berhasil diupdate!");
      fetchStats();
    } catch (error) {
      console.error("Error saving visitor stats:", error);
      alert("Gagal menyimpan. Silakan coba lagi.");
    }
    setSaving(false);
  }

  function formatNumber(num: number): string {
    return num.toLocaleString("id-ID");
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
        <h2 className="text-2xl font-bold text-gray-900">Statistik Pengunjung</h2>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{formatNumber(stats?.dailyVisitors || 0)}</p>
          <p className="text-sm text-gray-500 mt-1">Pengunjung Hari Ini</p>
        </Card>
        <Card className="p-6 text-center">
          <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{formatNumber(stats?.yearlyVisitors || 0)}</p>
          <p className="text-sm text-gray-500 mt-1">Pengunjung Tahun Ini</p>
        </Card>
        <Card className="p-6 text-center">
          <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{formatNumber(stats?.totalVisitors || 0)}</p>
          <p className="text-sm text-gray-500 mt-1">Total Pengunjung</p>
        </Card>
      </div>

      {/* Base Values Form */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-primary" />
            Atur Nilai Start
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Nilai start adalah angka dasar yang akan ditampilkan saat counter di-reset.
            Counter aktual = nilai start + jumlah pengunjung baru.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Start Harian</Label>
                <input
                  type="number"
                  value={form.baseDaily}
                  onChange={(e) => setForm((prev) => ({ ...prev, baseDaily: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Saat ini: {formatNumber(stats?.baseDaily || 0)}
                </p>
              </div>
              <div>
                <Label>Start Tahunan</Label>
                <input
                  type="number"
                  value={form.baseYearly}
                  onChange={(e) => setForm((prev) => ({ ...prev, baseYearly: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Saat ini: {formatNumber(stats?.baseYearly || 0)}
                </p>
              </div>
              <div>
                <Label>Start Total</Label>
                <input
                  type="number"
                  value={form.baseTotal}
                  onChange={(e) => setForm((prev) => ({ ...prev, baseTotal: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Saat ini: {formatNumber(stats?.baseTotal || 0)}
                </p>
              </div>
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

      {/* Info */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Counter increment otomatis setiap kali ada pengunjung baru (1x per hari per user)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Counter harian auto-reset setiap ganti tanggal
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Counter tahunan auto-reset setiap ganti tahun
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Counter total tidak pernah reset
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Nilai start bisa diubah kapan saja tanpa menghapus data pengunjung
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
