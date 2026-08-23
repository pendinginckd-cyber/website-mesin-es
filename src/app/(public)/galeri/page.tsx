"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { getGalleries } from "@/lib/firestore/galleries";
import { Gallery } from "@/types/gallery";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { Image as ImageIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function GaleriPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getGalleries({ isActive: true });
        setGalleries(data);
      } catch (error) {
        console.error("Error fetching galleries:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = filterCategory === "all"
    ? galleries
    : galleries.filter((g) => g.category === filterCategory);

  const lightboxImages = filtered.map((g) => g.imageUrl);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-video bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Galeri" },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Galeri Workshop & Produksi
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Lihat langsung proses pembuatan mesin es kristal di workshop kami, dari produksi hingga pengiriman.
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <button
          onClick={() => setFilterCategory("all")}
          className={`px-4 py-2 text-sm rounded-full border transition-colors ${
            filterCategory === "all"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          Semua
        </button>
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 text-sm rounded-full border transition-colors ${
              filterCategory === cat
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:border-primary"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 text-left"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-white/90 rounded-full">
                  <ImageIcon className="w-6 h-6 text-gray-700" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                {item.description && (
                  <p className="text-white/80 text-xs truncate">{item.description}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-1">Belum ada gambar untuk kategori ini.</p>
          <button
            onClick={() => setFilterCategory("all")}
            className="text-primary text-sm hover:underline"
          >
            Lihat semua gambar
          </button>
        </div>
      )}

      {/* Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={(index) => setLightboxIndex(index)}
      />

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-primary to-primary-dark rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Ingin Lihat Langsung?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Kunjungi workshop kami atau konsultasi online untuk melihat proses produksi secara langsung.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/kontak"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  );
}
