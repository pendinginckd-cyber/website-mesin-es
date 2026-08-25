"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProdukCard } from "@/components/public/produk-card";
import { getRelatedProducts, getOtherProducts } from "@/lib/firestore/products";
import { Product } from "@/types/product";

interface ProductRelatedSectionProps {
  currentSlug: string;
  category: string;
}

export function ProductRelatedSection({ currentSlug, category }: ProductRelatedSectionProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedHasMore, setRelatedHasMore] = useState(false);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedFetchedCount, setRelatedFetchedCount] = useState(8);

  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [otherHasMore, setOtherHasMore] = useState(false);
  const [otherLoading, setOtherLoading] = useState(false);
  const [otherFetchedCount, setOtherFetchedCount] = useState(8);

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setInitialLoading(true);

      const { products, hasMore } = await getRelatedProducts(
        currentSlug,
        category,
        8
      );
      setRelatedProducts(products);
      setRelatedHasMore(hasMore);

      const { products: other, hasMore: otherMore } = await getOtherProducts(
        currentSlug,
        category,
        8
      );
      setOtherProducts(other);
      setOtherHasMore(otherMore);

      setInitialLoading(false);
    }
    fetchData();
  }, [currentSlug, category]);

  async function handleLoadMoreRelated() {
    setRelatedLoading(true);
    const newLimit = relatedFetchedCount + 8;
    const { products, hasMore } = await getRelatedProducts(
      currentSlug,
      category,
      newLimit
    );
    setRelatedProducts(products);
    setRelatedHasMore(hasMore);
    setRelatedFetchedCount(newLimit);
    setRelatedLoading(false);
  }

  async function handleLoadMoreOther() {
    setOtherLoading(true);
    const newLimit = otherFetchedCount + 8;
    const { products, hasMore } = await getOtherProducts(
      currentSlug,
      category,
      newLimit
    );
    setOtherProducts(products);
    setOtherHasMore(hasMore);
    setOtherFetchedCount(newLimit);
    setOtherLoading(false);
  }

  if (initialLoading) {
    return (
      <div className="mt-16 pt-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Section: Produk Terkait */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProdukCard key={relatedProduct.slug} product={relatedProduct} />
              ))}
            </div>
            {relatedHasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMoreRelated}
                  disabled={relatedLoading}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors disabled:opacity-50 min-h-[44px] px-6 py-2"
                >
                  {relatedLoading ? "Memuat..." : "Lihat Lebih Banyak"}
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section: Produk Lainnya */}
      {otherProducts.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              Produk Lainnya
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {otherProducts.map((otherProduct) => (
                <ProdukCard key={otherProduct.slug} product={otherProduct} />
              ))}
            </div>
            {otherHasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMoreOther}
                  disabled={otherLoading}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors disabled:opacity-50 min-h-[44px] px-6 py-2"
                >
                  {otherLoading ? "Memuat..." : "Lihat Lebih Banyak"}
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}