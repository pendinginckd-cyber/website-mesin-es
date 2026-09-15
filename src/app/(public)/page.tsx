import { HeroSection } from "@/components/public/hero-section";
import { BannerCarousel } from "@/components/public/banner-carousel";
import { KeunggulanSection } from "@/components/public/keunggulan-section";
import { ProdukGrid } from "@/components/public/produk-grid";
import { TestimoniReviewSection } from "@/components/public/testimoni-review-section";
import { FaqSection } from "@/components/public/faq-section";
import { CTASection } from "@/components/public/cta-section";
import { VisitorStatsDisplay } from "@/components/public/visitor-stats-display";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { getFeaturedProducts, getProducts } from "@/lib/firestore/products";
import { SITE_NAME, SITE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import {
  COMPANY_NAME,
  BRAND,
  BUSINESS_ADDRESS,
  BUSINESS_GEO,
  BUSINESS_PHONE,
  BUSINESS_MAPS_SHORT,
  BUSINESS_HOURS,
  SERVICE_AREAS,
} from "@/lib/business";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jual Mesin Es Kristal Semarang | Pabrik & Service Ice Tube",
  description:
    "Pabrik & supplier mesin es kristal (ice tube) di Genuk Semarang oleh Cikal Jaya Teknik, merk EKN. Kapasitas 1-10 ton/hari, garansi resmi, sparepart lengkap, teknisi siap datang. Konsultasi gratis!",
  keywords: [
    "mesin es kristal semarang",
    "jual mesin es kristal semarang",
    "pabrik mesin es kristal semarang",
    "harga mesin es kristal semarang",
    "jual mesin es kristal",
    "harga mesin es kristal",
    "mesin es batu kristal",
    "mesin es kristal murah",
  ],
  openGraph: {
    title: "Jual Mesin Es Kristal Semarang | Pabrik & Service Ice Tube",
    description:
      "Pabrik & supplier mesin es kristal (ice tube) di Genuk Semarang oleh Cikal Jaya Teknik, merk EKN. Kapasitas 1-10 ton, garansi resmi, sparepart lengkap.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function HomePage() {
  let featuredProducts = await getFeaturedProducts(6);
  if (featuredProducts.length === 0) {
    featuredProducts = await getProducts({ isActive: true });
  }

  const localBusinessSchema = {
    "@type": "IndustrialBusiness",
    name: COMPANY_NAME,
    alternateName: `${SITE_NAME} (Merk ${BRAND})`,
    image: `${SITE_URL}/icon.png`,
    url: SITE_URL,
    telephone: BUSINESS_PHONE,
    address: {
      "@type": "PostalAddress",
      ...BUSINESS_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_GEO.latitude,
      longitude: BUSINESS_GEO.longitude,
    },
    hasMap: BUSINESS_MAPS_SHORT,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: BUSINESS_HOURS.days,
      opens: BUSINESS_HOURS.opens,
      closes: BUSINESS_HOURS.closes,
    },
    areaServed: [...SERVICE_AREAS],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
                logo: `${SITE_URL}/icon.png`,
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: `+${WHATSAPP_NUMBER}`,
                  contactType: "sales",
                  areaServed: "ID",
                  availableLanguage: "Indonesian",
                },
              },
              {
                "@type": "WebSite",
                name: SITE_NAME,
                url: SITE_URL,
              },
              localBusinessSchema,
            ],
          }),
        }}
      />
      <HeroSection />
      <BannerCarousel />
      <ScrollReveal>
        <KeunggulanSection />
      </ScrollReveal>
      <ScrollReveal>
        <ProdukGrid
          products={featuredProducts}
          title="Produk Unggulan Kami"
          showViewAll
        />
      </ScrollReveal>
      <ScrollReveal>
        <FaqSection />
      </ScrollReveal>
      <ScrollReveal>
        <TestimoniReviewSection title="Ulasan Pelanggan" testimonialsLimit={4} reviewLimit={4} />
      </ScrollReveal>
      <ScrollReveal>
        <VisitorStatsDisplay variant="section" />
      </ScrollReveal>
      <ScrollReveal>
        <CTASection />
      </ScrollReveal>
    </>
  );
}