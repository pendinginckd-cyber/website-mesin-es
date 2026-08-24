"use client";

import { useState, useEffect } from "react";
import { getVisitorStats } from "@/lib/firestore/visitor-stats";
import { VisitorStats } from "@/types/visitor-stats";
import { Eye } from "lucide-react";

interface VisitorStatsDisplayProps {
  variant?: "footer" | "section";
}

export function VisitorStatsDisplay({ variant = "footer" }: VisitorStatsDisplayProps) {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getVisitorStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching visitor stats:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !stats) return null;

  function formatNumber(num: number): string {
    return num.toLocaleString("id-ID");
  }

  if (variant === "section") {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Statistik Pengunjung</h2>
            <p className="text-gray-600">Terima kasih telah mengunjungi website kami</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <p className="text-3xl font-bold text-primary">{formatNumber(stats.dailyVisitors)}</p>
              <p className="text-sm text-gray-500 mt-1">Hari Ini</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <p className="text-3xl font-bold text-primary">{formatNumber(stats.yearlyVisitors)}</p>
              <p className="text-sm text-gray-500 mt-1">Tahun Ini</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <p className="text-3xl font-bold text-primary">{formatNumber(stats.totalVisitors)}</p>
              <p className="text-sm text-gray-500 mt-1">Total</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
      <Eye className="w-3.5 h-3.5" />
      <span>{formatNumber(stats.dailyVisitors)} pengunjung hari ini</span>
    </div>
  );
}
