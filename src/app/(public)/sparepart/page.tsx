"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSpareparts } from "@/lib/firestore/spareparts";
import { Sparepart } from "@/types/sparepart";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export default function SparepartPage() {
  const [spareparts, setSpareparts] = useState<Sparepart[]>([]);
  const [filtered, setFiltered] = useState<Sparepart[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSpareparts() {
      setLoading(true);
      try {
        const data = await getSpareparts({ isActive: true });
        setSpareparts(data);
        setFiltered(data);
        const cats = [...new Set(data.map((s) => s.category).filter(Boolean))];
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching spareparts:", error);
      }
      setLoading(false);
    }
    fetchSpareparts();
  }, []);

  useEffect(() => {
    let result = spareparts;

    if (search) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(keyword) ||
          s.description.toLowerCase().includes(keyword) ||
          s.shortDescription.toLowerCase().includes(keyword) ||
          s.category.toLowerCase().includes(keyword)
      );
    }

    if (selectedCategory) {
      result = result.filter((s) => s.category === selectedCategory);
    }

    setFiltered(result);
  }, [search, selectedCategory, spareparts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Sparepart" },
          ]}
        />

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Sparepart Mesin Es Kristal
          </h1>
          <p className="text-gray-600">
            Tersedia berbagai sparepart berkualitas untuk semua tipe mesin es kristal. Hubungi kami untuk pemesanan.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari sparepart..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              {search || selectedCategory
                ? "Tidak ada sparepart yang sesuai dengan pencarian Anda."
                : "Belum ada sparepart tersedia."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((sparepart) => (
              <Link key={sparepart.id} href={`/sparepart/${sparepart.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="aspect-square bg-gray-100 relative">
                    {sparepart.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sparepart.thumbnail}
                        alt={sparepart.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className={sparepart.stock === "tersedia" ? "bg-green-500 text-white" : sparepart.stock === "indent" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"}>
                        {sparepart.stock}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <Badge className="bg-blue-100 text-blue-800 w-fit mb-2">
                      {sparepart.category}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {sparepart.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">
                      {sparepart.shortDescription}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      Rp {sparepart.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
