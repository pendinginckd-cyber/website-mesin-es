"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSpareparts } from "@/lib/firestore/spareparts";
import { getSparepartSettings } from "@/lib/firestore/sparepart-settings";
import { Sparepart } from "@/types/sparepart";
import { Filter, X } from "lucide-react";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SparepartCard } from "@/components/public/sparepart-card";

function SparepartPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [spareparts, setSpareparts] = useState<Sparepart[]>([]);
  const [filtered, setFiltered] = useState<Sparepart[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  const activeSearch = searchParams.get("search") || "";
  const activeCategory = searchParams.get("kategori") || "";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [data, settings] = await Promise.all([
          getSpareparts({ isActive: true }),
          getSparepartSettings(),
        ]);
        setSpareparts(data);
        setCategories(settings.categories || []);
      } catch (error) {
        console.error("Error fetching spareparts:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let result = spareparts;

    if (activeSearch) {
      const keyword = activeSearch.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(keyword) ||
          s.description.toLowerCase().includes(keyword) ||
          s.shortDescription.toLowerCase().includes(keyword) ||
          s.category.toLowerCase().includes(keyword)
      );
    }

    if (activeCategory) {
      result = result.filter((s) => s.category === activeCategory);
    }

    setFiltered(result);
  }, [activeSearch, activeCategory, spareparts]);

  function handleCategoryChange(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("kategori", category);
    } else {
      params.delete("kategori");
    }
    router.push(`/sparepart?${params.toString()}`);
  }

  function clearSearch() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/sparepart?${params.toString()}`);
  }

  function clearCategory() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("kategori");
    router.push(`/sparepart?${params.toString()}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8">
          <div className="px-4 sm:px-6 lg:px-8">
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
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-6 px-0 sm:px-6 lg:px-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <div className="px-4 sm:px-6 lg:px-8">
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

        {/* Active Filters */}
        {(activeSearch || activeCategory) && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            {activeSearch && (
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-4 pr-2 py-2 shadow-sm">
                <span className="text-sm text-gray-700">
                  Pencarian: <strong className="text-gray-900">&quot;{activeSearch}&quot;</strong>
                </span>
                <button
                  onClick={clearSearch}
                  className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            )}
            {activeCategory && (
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-4 pr-2 py-2 shadow-sm">
                <span className="text-sm text-gray-700">
                  Kategori: <strong className="text-gray-900">{activeCategory}</strong>
                </span>
                <button
                  onClick={clearCategory}
                  className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Hapus filter kategori"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 mb-8">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={activeCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
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
        )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="mx-4 sm:mx-6 lg:mx-8 text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              {activeSearch || activeCategory
                ? "Tidak ada sparepart yang sesuai dengan pencarian Anda."
                : "Belum ada sparepart tersedia."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-6 px-0 sm:px-6 lg:px-8">
            {filtered.map((sparepart) => (
              <SparepartCard
                key={sparepart.id}
                name={sparepart.name}
                slug={sparepart.slug}
                thumbnail={sparepart.thumbnail}
                priceText={`Rp ${sparepart.price.toLocaleString("id-ID")}`}
                category={sparepart.category}
                stock={sparepart.stock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SparepartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SparepartPageContent />
    </Suspense>
  );
}
