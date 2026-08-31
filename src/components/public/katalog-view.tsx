"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileDown, Mail, MapPin, Phone, RefreshCcw } from "lucide-react";
import { Product } from "@/types/product";
import { ProdukCard } from "@/components/public/produk-card";
import { useContact } from "@/contexts/contact-context";
import { downloadKatalogPdf } from "@/lib/katalog/catalog-pdf";
import { SITE_NAME, SITE_URL, PRODUCT_CATEGORIES } from "@/lib/constants";

interface KatalogViewProps {
  products: Product[];
}

const CATEGORY_LABELS: Record<string, string> = {
  kecil: "Mesin Kapasitas Kecil",
  menengah: "Mesin Kapasitas Menengah",
  besar: "Mesin Kapasitas Besar",
};

export function KatalogView({ products }: KatalogViewProps) {
  const { contact, loading } = useContact();
  const [downloading, setDownloading] = useState(false);

  const waNumber = contact?.whatsappNumber;
  const email = contact?.email;
  const address = contact?.address;

  function handleDownload() {
    if (downloading || products.length === 0) return;
    setDownloading(true);
    downloadKatalogPdf(products, {
      siteName: SITE_NAME,
      siteUrl: SITE_URL,
      whatsappNumber: waNumber,
      email,
      address,
    })
      .catch(() => {
        window.open(
          `https://wa.me/${
            waNumber || "6281326440039"
          }?text=${encodeURIComponent(
            "Halo, saya ingin minta katalog mesin es kristal."
          )}`,
          "_blank"
        );
      })
      .finally(() => setDownloading(false));
  }

  const groups = PRODUCT_CATEGORIES.map((category) => ({
    category,
    label: CATEGORY_LABELS[category] ?? category,
    items: products
      .filter((p) => p.category === category)
      .sort(
        (a, b) =>
          a.capacityValue - b.capacityValue ||
          a.price - b.price ||
          a.name.localeCompare(b.name)
      ),
  })).filter((group) => group.items.length > 0);

  return (
    <div>
      {/* Header + Download */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
              <RefreshCcw className="w-4 h-4" />
              Ter-update otomatis dari data produk
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Katalog Mesin Es Kristal
            </h1>
            <p className="text-gray-600 max-w-xl">
              {products.length} mesin es kristal berkualitas — kapasitas kecil,
              menengah, dan besar. Katalog ini diperbarui otomatis setiap kali
              produk ditambahkan atau diubah.
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={handleDownload}
              disabled={downloading || products.length === 0}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed tap-effect"
            >
              <FileDown className="w-5 h-5" />
              {downloading ? "Menyusun PDF..." : "Unduh Brosur PDF"}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              PDF dibuat langsung dari data terbaru di browser Anda
            </p>
          </div>
        </div>

        {/* Contact strip */}
        <div className="mt-6 pt-5 border-t border-gray-100 grid sm:grid-cols-3 gap-3 text-sm">
          {waNumber && (
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              {loading ? "..." : `+${waNumber}`}
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          )}
          {address && (
            <div className="flex items-start gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="line-clamp-2 whitespace-pre-line">{address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Grouped by category */}
      {groups.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">
            Belum ada produk aktif. Silakan cek kembali nanti.
          </p>
          <Link
            href="/produk"
            className="inline-block mt-4 text-primary font-semibold hover:underline"
          >
            Lihat halaman produk
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.category}>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                  {group.items[0]?.thumbnail && (
                    <div className="relative w-12 h-12 rounded-l-lg overflow-hidden shrink-0">
                      <Image
                        src={group.items[0].thumbnail}
                        alt={group.label}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  )}
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 pr-4">
                    {group.label}
                  </h2>
                </div>
                <span className="text-sm text-gray-500">
                  {group.items.length} mesin
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {group.items.map((product) => (
                  <ProdukCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}