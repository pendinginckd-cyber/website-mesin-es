import { getSparepartBySlug, getSpareparts } from "@/lib/firestore/spareparts";
import { getProducts } from "@/lib/firestore/products";
import { getRelatedFaqs } from "@/lib/firestore/faqs";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ProductGallery } from "@/components/public/product-gallery";
import { ProdukCard } from "@/components/public/produk-card";
import { SparepartCard } from "@/components/public/sparepart-card";
import { DetailCta } from "@/components/public/detail-cta";
import { ShareButton } from "@/components/shared/share-button";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { FaqJsonLd } from "@/components/shared/faq-jsonld";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface MixItem {
  kind: "produk" | "sparepart";
  id: string;
  name: string;
  slug: string;
  category: string;
  thumbnail: string;
  priceText: string;
  stock: string;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sparepart Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-8">
            Sparepart yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Link href="/sparepart">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Sparepart
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(sparepart.stock);
  const images = sparepart.images.filter(Boolean);
  const waMessage = `Halo, saya tertarik dengan sparepart ${sparepart.name} (Rp ${sparepart.price.toLocaleString("id-ID")}). Apakah masih tersedia?`;

  const allProducts = await getProducts({ isActive: true });
  const allSpareparts = await getSpareparts({ isActive: true });
  const relatedProducts = allProducts.filter((p) => p.isFeatured).slice(0, 6);
  const mixItems: MixItem[] = [
    ...allProducts
      .filter((p) => !p.isFeatured)
      .map((p) => ({
        kind: "produk" as const,
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        thumbnail: p.thumbnail,
        priceText: p.priceDisplay,
        stock: p.stock,
      })),
    ...allSpareparts
      .filter((s) => s.id !== sparepart.id)
      .map((s) => ({
        kind: "sparepart" as const,
        id: s.id,
        name: s.name,
        slug: s.slug,
        category: s.category,
        thumbnail: s.thumbnail,
        priceText: `Rp ${s.price.toLocaleString("id-ID")}`,
        stock: s.stock,
      })),
  ].slice(0, 6);
  const relatedFaqs = await getRelatedFaqs([sparepart.name, sparepart.category], 5);

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

      <FaqJsonLd faqs={relatedFaqs} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: "Sparepart", href: "/sparepart" },
              { label: sparepart.name },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
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
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {sparepart.category}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                    {stockStatus.label}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {sparepart.name}
                </h1>
                <p className="text-2xl lg:text-3xl font-bold text-primary">
                  Rp {sparepart.price.toLocaleString("id-ID")}
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed whitespace-pre-line">
                  {sparepart.shortDescription || sparepart.description}
                </p>
              </div>

              <DetailCta waMessage={waMessage} />

              <div className="flex items-center justify-between mt-2">
                <ShareButton
                  title={sparepart.name}
                  message={[
                    `🧊 ${sparepart.name}`,
                    `💰 Rp ${sparepart.price.toLocaleString("id-ID")}`,
                    `🔧 Kategori: ${sparepart.category}`,
                  ].join("\n")}
                  imageUrl={sparepart.thumbnail}
                />
                <span className="text-xs text-gray-400">ID: {sparepart.slug}</span>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Deskripsi</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {sparepart.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Informasi Sparepart</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Kategori</dt>
                      <dd className="font-medium text-gray-900 capitalize">{sparepart.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Stok</dt>
                      <dd className="font-medium text-gray-900">{stockStatus.label}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">FAQ Terkait</h3>
                  <FaqAccordion faqs={relatedFaqs} />
                  {relatedFaqs.length > 0 && (
                    <Link
                      href="/faq"
                      className="mt-4 inline-block text-sm text-primary hover:underline"
                    >
                      Lihat semua FAQ
                    </Link>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">Butuh Bantuan?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Tim kami siap membantu Anda menemukan sparepart yang tepat untuk mesin es kristal Anda.
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

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Produk Terkait
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-6">
                {relatedProducts.map((product) => (
                  <ProdukCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Other Products */}
          {mixItems.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Produk Lainnya
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
                {mixItems.map((item) => (
                  <SparepartCard
                    key={`${item.kind}-${item.id}`}
                    name={item.name}
                    slug={item.slug}
                    thumbnail={item.thumbnail}
                    priceText={item.priceText}
                    category={item.category}
                    stock={item.stock}
                    href={item.kind === "produk" ? `/produk/${item.slug}` : `/sparepart/${item.slug}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
