import { Breadcrumb } from "@/components/shared/breadcrumb";
import { KatalogView } from "@/components/public/katalog-view";
import { getProducts } from "@/lib/firestore/products";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Katalog Mesin Es Kristal Terlengkap | ${SITE_NAME}`,
  description:
    "Unduh katalog PDF atau jelajahi katalog online mesin es kristal: kapasitas kecil, menengah, dan besar lengkap dengan harga, spesifikasi, dan garansi resmi.",
};

export default async function KatalogPage() {
  const products = await getProducts({ isActive: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Produk", href: "/produk" },
            { label: "Katalog" },
          ]}
        />

        <div className="mt-6">
          <KatalogView products={products} />
        </div>
      </div>
    </div>
  );
}