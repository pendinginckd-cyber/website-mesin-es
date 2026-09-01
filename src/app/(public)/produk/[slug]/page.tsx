import { getProductBySlug } from "@/lib/firestore/products";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGallery } from "@/components/public/product-gallery";
import { ProductSpecsTable } from "@/components/public/product-specs-table";
import { ProductCta } from "@/components/public/product-cta";
import { ShareButton } from "@/components/shared/share-button";
import { ProductRelatedSection } from "@/components/public/product-related-section";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import type { Metadata } from "next";

const PRICE_VALID_UNTIL = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan - Mesin Es Kristal",
      description: "Halaman produk yang Anda cari tidak tersedia.",
      robots: "noindex, nofollow",
    };
  }

  const title = product.seoTitle || `${product.name} - Harga ${product.priceDisplay} | ${SITE_NAME}`;
  const description = product.seoDescription || product.shortDescription;
  const canonical = product.seoCanonical || `${SITE_URL}/produk/${product.slug}`;
  const keywords = product.seoKeywords?.join(", ") || [
    "mesin es kristal",
    product.category,
    product.capacity,
    "harga mesin es",
    "jual mesin es",
    "mesin es batu",
  ].join(", ");

  return {
    title,
    description,
    alternates: { canonical },
    robots: product.seoNoIndex ? "noindex, nofollow" : "index, follow",
    keywords,
    openGraph: {
      title: product.seoTitle || product.name,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: product.thumbnail,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle || product.name,
      description,
      images: [product.thumbnail],
    },
  };
}

function getStockStatus(stock: string) {
  switch (stock) {
    case "tersedia":
      return { label: "Tersedia", color: "bg-green-100 text-green-800", icon: CheckCircle };
    case "indent":
      return { label: "Pre-Order", color: "bg-yellow-100 text-yellow-800", icon: CheckCircle };
    default:
      return { label: "Stok Habis", color: "bg-red-100 text-red-800", icon: CheckCircle };
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "kecil":
      return "bg-blue-100 text-blue-800";
    case "menengah":
      return "bg-yellow-100 text-yellow-800";
    case "besar":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default async function ProdukDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Produk Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-8">
            Maaf, produk yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Link href="/produk">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Katalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const StockIcon = stockStatus.icon;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.seoTitle || product.name,
            "image": Array.from(new Set([product.thumbnail, ...product.images])),
            "description": product.description,
            "sku": product.slug,
            "mpn": product.slug,
            "brand": { "@type": "Brand", "name": SITE_NAME },
            "category": product.category,
            "material": product.material,
            "offers": {
              "@type": "Offer",
              "url": `${SITE_URL}/produk/${product.slug}`,
              "priceCurrency": "IDR",
              "price": product.price,
              "priceValidUntil": PRICE_VALID_UNTIL,
              "availability": product.stock === "tersedia"
                ? "https://schema.org/InStock"
                : product.stock === "indent"
                ? "https://schema.org/PreOrder"
                : "https://schema.org/OutOfStock",
              "seller": { "@type": "Organization", "name": SITE_NAME },
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: "Produk", href: "/produk" },
              { label: product.name },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductGallery
            thumbnail={product.thumbnail}
            images={product.images}
            videoUrl={product.videoUrl}
            productName={product.name}
          />

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                  Kapasitas {product.capacity}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${stockStatus.color}`}>
                  <StockIcon className="w-3 h-3" />
                  {stockStatus.label}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-2xl lg:text-3xl font-bold text-primary">
                {product.priceDisplay}
              </p>
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            <ProductCta product={product} />

            <div className="flex items-center justify-between mt-2">
              <ShareButton
                title={product.name}
                message={[
                  `🧊 ${product.name}`,
                  `💰 ${product.priceDisplay}`,
                  `✅ Garansi resmi ${product.warranty}`,
                ].join("\n")}
                imageUrl={product.thumbnail}
              />
              <span className="text-xs text-gray-400">ID: {product.slug}</span>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Keunggulan Produk</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Garansi {product.warranty}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Material: {product.material}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Kapasitas: {product.capacity}
                  </li>
                  {product.certifications && product.certifications.length > 0 && (
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      Sertifikasi: {product.certifications.join(", ")}
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Produk</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Spesifikasi Teknis</h2>
                <ProductSpecsTable specifications={product.specifications} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Informasi Produk</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Kategori</dt>
                    <dd className="font-medium text-gray-900 capitalize">{product.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Kapasitas</dt>
                    <dd className="font-medium text-gray-900">{product.capacity}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Material</dt>
                    <dd className="font-medium text-gray-900">{product.material}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Stok</dt>
                    <dd className="font-medium text-gray-900">{stockStatus.label}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Garansi</dt>
                    <dd className="font-medium text-gray-900 text-right">{product.warranty}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {product.roiEstimation && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Estimasi ROI</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Pendapatan/Hari</dt>
                      <dd className="font-medium text-green-600">
                        Rp {product.roiEstimation.dailyRevenue.toLocaleString("id-ID")}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Biaya/Hari</dt>
                      <dd className="font-medium text-red-600">
                        Rp {product.roiEstimation.dailyCost.toLocaleString("id-ID")}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Profit/Hari</dt>
                      <dd className="font-medium text-primary">
                        Rp {product.roiEstimation.dailyProfit.toLocaleString("id-ID")}
                      </dd>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <dt className="text-gray-500 font-medium">Payback Period</dt>
                      <dd className="font-bold text-primary">{product.roiEstimation.paybackPeriod}</dd>
                    </div>
                  </dl>
                  <Link
                    href={`/kalkulator?capacity=${product.capacityValue}&machinePrice=${product.price}`}
                    className="mt-4 inline-flex items-center justify-center w-full bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Hitung Simulasi ROI
                  </Link>
                </CardContent>
              </Card>
            )}

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">Butuh Bantuan?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tim kami siap membantu Anda memilih mesin es yang tepat untuk kebutuhan usaha Anda.
                </p>
                <a href="tel:+6281326440039" className="block">
                  <Button variant="primary" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    0813-2644-0039
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Related Sections (Client Component for load more) */}
        <ProductRelatedSection
          currentSlug={product.slug}
          category={product.category}
        />
        </div>
      </div>
    </>
  );
}