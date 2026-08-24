"use client";

import { HeroSection } from "@/components/public/hero-section";
import { BannerCarousel } from "@/components/public/banner-carousel";
import { KeunggulanSection } from "@/components/public/keunggulan-section";
import { ProdukGrid } from "@/components/public/produk-grid";
import { TestimoniSection } from "@/components/public/testimoni-section";
import { ReviewSection } from "@/components/public/review-section";
import { FaqSection } from "@/components/public/faq-section";
import { CTASection } from "@/components/public/cta-section";
import { FloatingWhatsApp } from "@/components/public/floating-whatsapp";
import { VisitorStatsDisplay } from "@/components/public/visitor-stats-display";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { useState, useEffect } from "react";
import { getFeaturedProducts, getProducts } from "@/lib/firestore/products";
import { Product } from "@/types/product";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        let products = await getFeaturedProducts(6);
        if (products.length === 0) {
          products = await getProducts({ isActive: true });
        }
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        try {
          const allProducts = await getProducts({ isActive: true });
          setFeaturedProducts(allProducts);
        } catch {
          // ignore
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <HeroSection />
      <BannerCarousel />
      <ScrollReveal>
        <KeunggulanSection />
      </ScrollReveal>
      {!loading && (
        <ScrollReveal>
          <ProdukGrid
            products={featuredProducts}
            title="Produk Unggulan Kami"
            showViewAll
          />
        </ScrollReveal>
      )}
      <ScrollReveal>
        <FaqSection />
      </ScrollReveal>
      <ScrollReveal>
        <TestimoniSection />
      </ScrollReveal>
      <ScrollReveal>
        <ReviewSection title="Ulasan Terverifikasi" limit={4} />
      </ScrollReveal>
      <ScrollReveal>
        <VisitorStatsDisplay variant="section" />
      </ScrollReveal>
      <ScrollReveal>
        <CTASection />
      </ScrollReveal>
      <FloatingWhatsApp />
    </>
  );
}
