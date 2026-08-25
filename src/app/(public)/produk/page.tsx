import { getProducts, searchProducts } from "@/lib/firestore/products";
import { ProdukGrid } from "@/components/public/produk-grid";
import { ProdukFilterBar } from "@/components/public/produk-filter-bar";
import { Product } from "@/types/product";

export const metadata = {
  title: "Produk Mesin Es Kristal - Katalog Lengkap",
  description: "Katalog mesin es kristal berbagai kapasitas. Filter dan cari produk sesuai kebutuhan Anda.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    kategori?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    minCapacity?: string;
    maxCapacity?: string;
  }>;
}

export default async function ProdukPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const allProducts = await getProducts({ isActive: true });

  const categoriesWithProducts = [...new Set(allProducts.map((p) => p.category))];

  const priceRange = {
    min: allProducts.length > 0 ? Math.min(...allProducts.map((p) => p.price)) : 0,
    max: allProducts.length > 0 ? Math.max(...allProducts.map((p) => p.price)) : 0,
  };

  const capacityRange = {
    min: allProducts.length > 0 ? Math.min(...allProducts.map((p) => p.capacityValue)) : 0,
    max: allProducts.length > 0 ? Math.max(...allProducts.map((p) => p.capacityValue)) : 0,
  };

  const filters = {
    search: params.search,
    category: params.kategori,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
    minCapacity: params.minCapacity ? parseFloat(params.minCapacity) : undefined,
    maxCapacity: params.maxCapacity ? parseFloat(params.maxCapacity) : undefined,
    sortBy: params.sort,
  };

  const filteredProducts = await searchProducts(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Katalog Mesin Es Kristal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilihan mesin es kristal berkualitas untuk kebutuhan usaha Anda.
            Gunakan filter di bawah untuk menemukan produk yang tepat.
          </p>
        </div>

        <ProdukFilterBar
          currentParams={params}
          totalProducts={allProducts.length}
          filteredCount={filteredProducts.length}
          priceRange={priceRange}
          capacityRange={capacityRange}
          categories={categoriesWithProducts}
        />

        <ProdukGrid products={filteredProducts} />

        {!filteredProducts.length && (
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