"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { searchProducts } from "@/lib/firestore/products";
import { ProdukGrid } from "@/components/public/produk-grid";
import { Product } from "@/types/product";

function ProdukPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch & filter products based on URL params
  useEffect(() => {
    async function applyFilters() {
      setLoading(true);
      const params = Object.fromEntries(searchParams.entries());
      const filtered = await searchProducts({
        search: params.search,
        category: params.kategori,
        minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
        minCapacity: params.minCapacity ? parseFloat(params.minCapacity) : undefined,
        maxCapacity: params.maxCapacity ? parseFloat(params.maxCapacity) : undefined,
        sortBy: params.sort,
      });
      setFilteredProducts(filtered);
      setLoading(false);
    }
    applyFilters();
  }, [searchParams]);


  const activeSearch = searchParams.get("search") || "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Katalog Mesin Es Kristal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilihan mesin es kristal berkualitas untuk kebutuhan usaha Anda.
          </p>
        </div>

        {/* Active Search Chip */}
        {activeSearch && (
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-4 pr-2 py-2 shadow-sm">
              <span className="text-sm text-gray-700">
                Hasil pencarian:{" "}
                <strong className="text-gray-900">&quot;{activeSearch}&quot;</strong>
              </span>
              <button
                onClick={() => router.push("/produk")}
                className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <ProdukGrid products={filteredProducts} loading={loading} />

        {/* Empty State */}
        {!loading && !filteredProducts.length && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak Ada Produk yang Sesuai
            </h2>
            <p className="text-gray-600">
              Coba ubah kata kunci pencarian Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProdukPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ProdukPageContent />
    </Suspense>
  );
}
