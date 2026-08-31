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
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mesin Es Kristal Berkualitas | Garansi Resmi & Hemat Listrik",
  description:
    "Jual mesin es kristal kapasitas 1-10 ton/hari. Garansi resmi, suku cadang lengkap, teknisi siap datang. Konsultasi gratis!",
  keywords: [
    "jual mesin es kristal",
    "harga mesin es kristal",
    "mesin es batu kristal",
    "mesin es kristal murah",
  ],
  openGraph: {
    title: "Mesin Es Kristal Berkualitas | Garansi Resmi & Hemat Listrik",
    description:
      "Jual mesin es kristal kapasitas 1-10 ton/hari. Garansi resmi, suku cadang lengkap, teknisi siap datang.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
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

  return (
    <>
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