"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProducts, searchProducts } from "@/lib/firestore/products";
import { ProdukGrid } from "@/components/public/produk-grid";
import { ProdukFilterSidebar } from "@/components/public/produk-filter-sidebar";
import { ProdukIconBar } from "@/components/public/produk-icon-bar";
import { ProdukSearchModal } from "@/components/public/produk-search-modal";
import { ProdukFilterBottomSheet } from "@/components/public/produk-filter-bottom-sheet";
import { Product } from "@/types/product";

interface FilterState {
  search?: string;
  kategori?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  maxCapacity?: number;
}

function ProdukPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Desktop state
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mobile state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // Fetch products
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const products = await getProducts({ isActive: true });
      setAllProducts(products);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Filter products based on URL params
  useEffect(() => {
    async function applyFilters() {
      const params = Object.fromEntries(searchParams.entries());
      const filters = {
        search: params.search,
        category: params.kategori,
        minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
        minCapacity: params.minCapacity ? parseFloat(params.minCapacity) : undefined,
        maxCapacity: params.maxCapacity ? parseFloat(params.maxCapacity) : undefined,
        sortBy: params.sort,
      };

      const filtered = await searchProducts(filters);
      setFilteredProducts(filtered);

      // Show sidebar if user has interacted
      const hasInteracted =
        params.search ||
        params.kategori ||
        params.sort ||
        params.minPrice ||
        params.minCapacity;
      setShowSidebar(!!hasInteracted);
    }
    applyFilters();
  }, [searchParams]);

  // Handle search modal from navbar
  useEffect(() => {
    if (searchParams.get("searchModal") === "true") {
      setSearchModalOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("searchModal");
      router.replace(`/produk?${params.toString()}`);
    }
  }, [searchParams, router]);

  // Derived data
  const categoriesWithProducts = [...new Set(allProducts.map((p) => p.category))];

  const priceRange = {
    min: allProducts.length > 0 ? Math.min(...allProducts.map((p) => p.price)) : 0,
    max: allProducts.length > 0 ? Math.max(...allProducts.map((p) => p.price)) : 0,
  };

  const capacityRange = {
    min: allProducts.length > 0 ? Math.min(...allProducts.map((p) => p.capacityValue)) : 0,
    max: allProducts.length > 0 ? Math.max(...allProducts.map((p) => p.capacityValue)) : 0,
  };

  // Filter count calculation
  function getFilterCount(): number {
    let count = 0;
    if (searchParams.get("search")) count++;
    if (searchParams.get("kategori")) count++;
    if (searchParams.get("sort")) count++;
    if (searchParams.get("minPrice") || searchParams.get("maxPrice")) count++;
    if (searchParams.get("minCapacity") || searchParams.get("maxCapacity")) count++;
    return count;
  }

  // Handle apply filters from mobile bottom sheet
  function handleApplyFilters(filters: FilterState) {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.kategori) params.set("kategori", filters.kategori);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.minCapacity) params.set("minCapacity", filters.minCapacity.toString());
    if (filters.maxCapacity) params.set("maxCapacity", filters.maxCapacity.toString());

    router.push(`/produk?${params.toString()}`);
    setFilterSheetOpen(false);
  }

  const currentParams = Object.fromEntries(searchParams.entries());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Icon Bar */}
      <div className="md:hidden sticky top-16 z-40 bg-white">
        <ProdukIconBar
          onSearchClick={() => setSearchModalOpen(true)}
          onFilterClick={() => setFilterSheetOpen(true)}
          filterCount={getFilterCount()}
        />
      </div>

      {/* Mobile Search Modal */}
      <ProdukSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        defaultValue={searchParams.get("search") || undefined}
      />

      {/* Mobile Filter Bottom Sheet */}
      <ProdukFilterBottomSheet
        isOpen={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        currentParams={currentParams}
        priceRange={priceRange}
        capacityRange={capacityRange}
        categories={categoriesWithProducts}
        onApply={handleApplyFilters}
      />

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

        {/* Desktop Filter Sidebar (conditional) */}
        {showSidebar && (
          <div className="hidden md:block mb-8">
            <ProdukFilterSidebar
              currentParams={currentParams}
              totalProducts={allProducts.length}
              filteredCount={filteredProducts.length}
              priceRange={priceRange}
              capacityRange={capacityRange}
              categories={categoriesWithProducts}
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
            />
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
              Coba ubah filter atau kata kunci pencarian Anda.
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