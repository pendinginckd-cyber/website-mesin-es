"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSparepartBySlug } from "@/lib/firestore/spareparts";
import { getProducts } from "@/lib/firestore/products";
import { Sparepart } from "@/types/sparepart";
import { Product } from "@/types/product";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { Phone, ArrowLeft, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export default function SparepartDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [sparepart, setSparepart] = useState<Sparepart | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getSparepartBySlug(slug);
        setSparepart(data);

        if (data) {
          const allProducts = await getProducts({ isActive: true });
          const related = allProducts.filter((p) => p.isFeatured).slice(0, 4);
          const other = allProducts.filter((p) => !p.isFeatured).slice(0, 4);
          setRelatedProducts(related);
          setOtherProducts(other);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!sparepart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Sparepart Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">
            Sparepart yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Link
            href="/sparepart"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Sparepart
          </Link>
        </div>
      </div>
    );
  }

  const images = sparepart.images.filter(Boolean);
  const waMessage = encodeURIComponent(
    `Halo, saya tertarik dengan sparepart ${sparepart.name} (Rp ${sparepart.price.toLocaleString("id-ID")}). Apakah masih tersedia?`
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Sparepart", href: "/sparepart" },
            { label: sparepart.name },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={images[currentImageIndex]}
                    alt={sparepart.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>No Image</span>
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 ${
                        i === currentImageIndex ? "border-primary" : "border-gray-200"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`${sparepart.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <Badge className="bg-blue-100 text-blue-800 mb-3">
                {sparepart.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {sparepart.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={sparepart.stock === "tersedia" ? "bg-green-100 text-green-800" : sparepart.stock === "indent" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                  {sparepart.stock === "tersedia" ? "Tersedia" : sparepart.stock === "indent" ? "Indent" : "Habis"}
                </Badge>
              </div>
              <p className="text-3xl font-bold text-primary">
                Rp {sparepart.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {sparepart.description}
              </p>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors w-full"
            >
              <Phone className="w-5 h-5" />
              Pesan via WhatsApp
            </a>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Link key={product.id} href={`/produk/${product.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    <div className="aspect-square bg-gray-100 relative">
                      {product.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <Badge className="bg-blue-100 text-blue-800 w-fit mb-2">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-primary">
                        {product.priceDisplay}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Products */}
        {otherProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Produk Lainnya
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherProducts.map((product) => (
                <Link key={product.id} href={`/produk/${product.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    <div className="aspect-square bg-gray-100 relative">
                      {product.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <Badge className="bg-blue-100 text-blue-800 w-fit mb-2">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-primary">
                        {product.priceDisplay}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
