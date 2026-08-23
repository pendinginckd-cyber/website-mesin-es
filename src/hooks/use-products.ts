"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { getProducts, getFeaturedProducts } from "@/lib/firestore/products";

export function useProducts(params?: {
  category?: string;
  isFeatured?: boolean;
  limit?: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = params?.isFeatured
          ? await getFeaturedProducts(params.limit)
          : await getProducts(params);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError("Gagal memuat data produk");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [params?.category, params?.isFeatured, params?.limit]);

  return { products, loading, error };
}
