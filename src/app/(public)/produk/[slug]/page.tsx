import { getProductBySlug } from "@/lib/firestore/products";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Specification } from "@/types/product";
import { ProductGallery } from "@/components/public/product-gallery";

const PRICE_VALID_UNTIL = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.seoTitle || product.name,
    "image": [product.thumbnail, ...product.images],
    "description": product.description,
    "sku": product.slug,
    "mpn": product.slug,
    "brand": { "@type": "Brand", "name": SITE_NAME },
    "category": product.category,
    "material": product.material,
    "weight": { "@type": "QuantitativeValue", "value": product.capacityValue, "unitCode": "TON" },
    "offers": {
      "@type": "Offer",
      "url": canonical,
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
    "aggregateRating": product.isFeatured ? {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
    } : undefined,
  };

  return {
    title,
    description,
    canonical,
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
    other: {
      "script:ld+json": JSON.stringify(productSchema),
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
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
  const whatsappUrl = `https://wa.me/6281326440039?text=${encodeURIComponent(`Halo, saya tertarik dengan ${product.name} - ${product.priceDisplay}`)}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.seoTitle || product.name,
            "image": [product.thumbnail, ...product.images],
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Beranda</Link>
          <span>/</span>
          <Link href="/produk" className="hover:text-primary">Produk</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

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

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="primary" size="lg" className="w-full">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Pesan via WhatsApp
                </Button>
              </a>
              <a href="tel:+6281326440039" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  <Phone className="w-5 h-5 mr-2" />
                  Hubungi Kami
                </Button>
              </a>
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
                <table className="w-full">
                  <tbody>
                    {product.specifications.map((spec: Specification, idx: number) => (
                      <tr key={idx} className={idx !== 0 ? "border-t border-gray-100" : ""}>
                        <td className="py-3 pr-4 text-gray-500 w-1/3">{spec.label}</td>
                        <td className="py-3 font-medium text-gray-900">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
      </div>
    </>
  );
}