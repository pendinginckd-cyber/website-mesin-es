import { getSparepartBySlug } from "@/lib/firestore/spareparts";
import { getProducts } from "@/lib/firestore/products";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft, Phone, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ProductGallery } from "@/components/public/product-gallery";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sparepart = await getSparepartBySlug(slug);

  if (!sparepart) {
    return {
      title: "Sparepart Tidak Ditemukan - Mesin Es Kristal",
      description: "Halaman sparepart yang Anda cari tidak tersedia.",
      robots: "noindex, nofollow",
    };
  }

  const title = sparepart.seoTitle || `${sparepart.name} - Harga Rp ${sparepart.price.toLocaleString("id-ID")} | ${SITE_NAME}`;
  const description = sparepart.seoDescription || sparepart.shortDescription;
  const canonical = sparepart.seoCanonical || `${SITE_URL}/sparepart/${sparepart.slug}`;
  const keywords = sparepart.seoKeywords?.join(", ") || [
    "sparepart mesin es kristal",
    sparepart.category,
    sparepart.name,
    "jual sparepart mesin es",
    "komponen mesin es",
  ].join(", ");

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": sparepart.seoTitle || sparepart.name,
    "image": [sparepart.thumbnail, ...sparepart.images].filter(Boolean),
    "description": sparepart.description,
    "sku": sparepart.slug,
    "brand": { "@type": "Brand", "name": SITE_NAME },
    "category": sparepart.category,
    "offers": {
      "@type": "Offer",
      "url": canonical,
      "priceCurrency": "IDR",
      "price": sparepart.price,
      "availability": sparepart.stock === "tersedia"
        ? "https://schema.org/InStock"
        : sparepart.stock === "indent"
        ? "https://schema.org/PreOrder"
        : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": SITE_NAME },
    },
  };

  return {
    title,
    description,
    alternates: { canonical },
    robots: sparepart.seoNoIndex ? "noindex, nofollow" : "index, follow",
    keywords,
    openGraph: {
      title: sparepart.seoTitle || sparepart.name,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: sparepart.thumbnail || "/icon.png",
          width: 800,
          height: 600,
          alt: sparepart.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: sparepart.seoTitle || sparepart.name,
      description,
      images: [sparepart.thumbnail || "/icon.png"],
    },
    other: {
      "script:ld+json": JSON.stringify(productSchema),
    },
  };
}

function getStockStatus(stock: string) {
  switch (stock) {
    case "tersedia":
      return { label: "Tersedia", color: "bg-green-100 text-green-800" };
    case "indent":
      return { label: "Indent", color: "bg-yellow-100 text-yellow-800" };
    default:
      return { label: "Habis", color: "bg-red-100 text-red-800" };
  }
}

export default async function SparepartDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const sparepart = await getSparepartBySlug(slug);

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

  const stockStatus = getStockStatus(sparepart.stock);
  const images = sparepart.images.filter(Boolean);
  const waMessage = encodeURIComponent(
    `Halo, saya tertarik dengan sparepart ${sparepart.name} (Rp ${sparepart.price.toLocaleString("id-ID")}). Apakah masih tersedia?`
  );

  const allProducts = await getProducts({ isActive: true });
  const relatedProducts = allProducts.filter((p) => p.isFeatured).slice(0, 4);
  const otherProducts = allProducts.filter((p) => !p.isFeatured).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": sparepart.seoTitle || sparepart.name,
            "image": [sparepart.thumbnail, ...sparepart.images].filter(Boolean),
            "description": sparepart.description,
            "sku": sparepart.slug,
            "brand": { "@type": "Brand", "name": SITE_NAME },
            "category": sparepart.category,
            "offers": {
              "@type": "Offer",
              "url": `${SITE_URL}/sparepart/${sparepart.slug}`,
              "priceCurrency": "IDR",
              "price": sparepart.price,
              "availability": sparepart.stock === "tersedia"
                ? "https://schema.org/InStock"
                : sparepart.stock === "indent"
                ? "https://schema.org/PreOrder"
                : "https://schema.org/OutOfStock",
              "seller": { "@type": "Organization", "name": SITE_NAME },
            },
          }),
        }}
      />

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
              <ProductGallery
                thumbnail={sparepart.thumbnail}
                images={sparepart.images}
                videoUrl={undefined}
                productName={sparepart.name}
              />
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
                  <Badge className={stockStatus.color}>
                    {stockStatus.label}
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
    </>
  );
}
