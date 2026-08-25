import { Suspense } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ArtikelFilter } from "@/components/public/artikel-filter";
import { ArtikelGrid } from "@/components/public/artikel-grid";
import { getArticles } from "@/lib/firestore/articles";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Artikel & Tips Bisnis Es Kristal | ${SITE_NAME}`,
  description: "Panduan lengkap seputar bisnis es kristal, perawatan mesin, dan tips meningkatkan profit.",
  alternates: {
    canonical: `${SITE_URL}/artikel`,
  },
};

function ArtikelFilterWrapper({
  categories,
  activeCategory,
}: {
  categories: string[];
  activeCategory: string;
}) {
  return <ArtikelFilter categories={categories} activeCategory={activeCategory} />;
}

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;

  const allArticles = await getArticles({ isPublished: true });

  const categories = [
    "Semua",
    ...new Set(allArticles.map((a) => a.category).filter(Boolean)),
  ];

  const articles =
    kategori && kategori !== "Semua"
      ? allArticles.filter((a) => a.category === kategori)
      : allArticles;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={[{ label: "Artikel" }]} />

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Artikel & Tips Bisnis Es Kristal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Panduan lengkap seputar bisnis es kristal, perawatan mesin, dan tips
            meningkatkan profit.
          </p>
        </div>

        <Suspense fallback={<div className="h-10 mb-8" />}>
          <ArtikelFilterWrapper categories={categories} activeCategory={kategori || "Semua"} />
        </Suspense>

        <ArtikelGrid articles={articles} />
      </div>
    </div>
  );
}
