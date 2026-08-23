"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  FileText,
  Video,
  Users,
  MessageSquare,
  Star,
  ArrowRight,
} from "lucide-react";
import { getProducts } from "@/lib/firestore/products";
import { getArticles } from "@/lib/firestore/articles";
import { getVideos } from "@/lib/firestore/videos";
import { getLeads } from "@/lib/firestore/leads";
import { getTestimonials } from "@/lib/firestore/testimonials";

interface DashboardStats {
  totalProducts: number;
  totalArticles: number;
  totalVideos: number;
  totalLeads: number;
  newLeads: number;
  totalTestimonials: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalArticles: 0,
    totalVideos: 0,
    totalLeads: 0,
    newLeads: 0,
    totalTestimonials: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [products, articles, videos, allLeads, newLeadsData, testimonials] = await Promise.all([
        getProducts(),
        getArticles(),
        getVideos(),
        getLeads(),
        getLeads({ status: "new" }),
        getTestimonials(),
      ]);

      setStats({
        totalProducts: products.length,
        totalArticles: articles.length,
        totalVideos: videos.length,
        totalLeads: allLeads.length,
        newLeads: newLeadsData.length,
        totalTestimonials: testimonials.length,
      });

      setRecentLeads(allLeads.slice(0, 5));
      setRecentProducts(products.slice(0, 3));
      setRecentArticles(articles.slice(0, 3));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Produk", value: stats.totalProducts, icon: Package, color: "bg-blue-500", href: "/admin/produk" },
    { label: "Total Artikel", value: stats.totalArticles, icon: FileText, color: "bg-green-500", href: "/admin/artikel" },
    { label: "Total Video", value: stats.totalVideos, icon: Video, color: "bg-purple-500", href: "/admin/video" },
    { label: "Total Leads", value: stats.totalLeads, icon: Users, color: "bg-yellow-500", href: "/admin/leads" },
    { label: "Leads Baru", value: stats.newLeads, icon: MessageSquare, color: "bg-red-500", href: "/admin/leads" },
    { label: "Total Testimoni", value: stats.totalTestimonials, icon: Star, color: "bg-indigo-500", href: "/admin/testimoni" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shrink-0`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="text-lg font-semibold text-gray-900">Leads Terbaru</h3>
          <Link href="/admin/leads" className="text-sm text-primary hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="px-6 pb-6">
          {recentLeads.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Belum ada leads.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">No. HP</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Produk</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-sm font-medium text-gray-900">{lead.name}</td>
                      <td className="py-2 px-2 text-sm text-gray-600">{lead.phone}</td>
                      <td className="py-2 px-2 text-sm text-gray-600 hidden md:table-cell">{lead.productInterest || "-"}</td>
                      <td className="py-2 px-2"><StatusBadge status={lead.status} /></td>
                      <td className="py-2 px-2 text-sm text-gray-500 hidden sm:table-cell">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-6 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Produk Terbaru</h3>
            <Link href="/admin/produk" className="text-sm text-primary hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="px-6 pb-6">
            {recentProducts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Belum ada produk.</p>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                    {product.thumbnail || product.images?.[0] ? (
                      <img src={product.thumbnail || product.images?.[0]} alt={product.name} className="w-12 h-12 rounded object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-200 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {product.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-6 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Artikel Terbaru</h3>
            <Link href="/admin/artikel" className="text-sm text-primary hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="px-6 pb-6">
            {recentArticles.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Belum ada artikel.</p>
            ) : (
              <div className="space-y-3">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                    {article.coverImage ? (
                      <img src={article.coverImage} alt={article.title} className="w-12 h-12 rounded object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-200 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                      <p className="text-xs text-gray-500">{article.category || "-"}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${article.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {article.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-red-100 text-red-800",
    contacted: "bg-yellow-100 text-yellow-800",
    converted: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };
  const labels: Record<string, string> = {
    new: "Baru",
    contacted: "Dihubungi",
    converted: "Converted",
    closed: "Closed",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {labels[status] || status}
    </span>
  );
}
