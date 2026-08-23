import { getProducts } from "@/lib/firestore/products";
import { ProdukGrid } from "@/components/public/produk-grid";
import { Product } from "@/types/product";

export const metadata = {
  title: "Produk Mesin Es Kristal - Katalog Lengkap",
  description: "Katalog mesin es kristal berbagai kapasitas. 1 ton, 3 ton, dan 5 ton. Harga terbaru dan spesifikasi lengkap.",
};

// Force dynamic rendering (no caching)
export const dynamic = "force-dynamic";

export default async function ProdukPage() {
  let products: Product[] = [];
  let loading = true;

  try {
    console.log("Fetching products from Firestore...");
    products = await getProducts({ isActive: true });
    console.log("Products fetched:", products.length);
    loading = false;
    
    // Fallback: if no products with isActive filter, try without filter
    if (products.length === 0) {
      console.log("No active products, trying without filter...");
      products = await getProducts();
      console.log("All products fetched:", products.length);
      loading = false;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback: try without any filters
    try {
      products = await getProducts();
      console.log("Fallback - all products:", products.length);
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
    }
    loading = false;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-0.5">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Katalog Mesin Es Kristal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilihan mesin es kristal berkualitas untuk kebutuhan usaha Anda. 
            Kapasitas 1 ton hingga 10 ton per hari.
          </p>
        </div>

        <ProdukGrid 
          products={products} 
          loading={loading}
        />

        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Produk
            </h2>
            <p className="text-gray-600">
              Produk akan segera ditambahkan. Silakan hubungi kami untuk informasi lebih lanjut.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}