"use client";

import { useState, useEffect } from "react";
import { Article } from "@/types/article";
import { getArticles, getPublishedArticles } from "@/lib/firestore/articles";

export function useArticles(params?: {
  category?: string;
  limit?: number;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const data = await getPublishedArticles(params?.limit || 12);
        const filtered = params?.category
          ? data.filter((a) => a.category === params.category)
          : data;
        setArticles(filtered);
        setError(null);
      } catch (err) {
        setError("Gagal memuat data artikel");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [params?.category, params?.limit]);

  return { articles, loading, error };
}
