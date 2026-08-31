import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ProductComparison } from "@/components/public/product-comparison";
import { getProducts } from "@/lib/firestore/products";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Bandingkan Mesin Es Kristal | ${SITE_NAME}`,
  description:
    "Bandingkan spesifikasi, harga, kapasitas, dan garansi dari beberapa mesin es kristal secara berdampingan untuk memilih mesin terbaik bagi usaha Anda.",
};

export default async function BandingkanPage() {
  const products = await getProducts({ isActive: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Produk", href: "/produk" },
            { label: "Bandingkan" },
          ]}
        />

        <div className="text-center mb-10 mt-6">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
            Bandingkan Mesin Es Kristal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih 2-3 produk dan bandingkan spesifikasi, harga, kapasitas, dan
            garansi secara berdampingan.
          </p>
        </div>

        <ProductComparison products={products} />
      </div>
    </div>
  );
}