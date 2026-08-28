"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/firestore/products";
import { getArticles } from "@/lib/firestore/articles";
import { getVideos } from "@/lib/firestore/videos";
import { getSpareparts } from "@/lib/firestore/spareparts";
import { Product } from "@/types/product";
import { Article } from "@/types/article";
import { Video } from "@/types/video";
import { Sparepart } from "@/types/sparepart";

interface SearchContent {
  products: Product[];
  articles: Article[];
  videos: Video[];
  spareparts: Sparepart[];
}

let cache: SearchContent | null = null;

export function useSearchContent(enabled: boolean) {
  const [data, setData] = useState<SearchContent>(
    cache ?? { products: [], articles: [], videos: [], spareparts: [] }
  );
  const [loaded, setLoaded] = useState(!!cache);

  useEffect(() => {
    if (!enabled || cache) return;
    let active = true;
    Promise.all([
      getProducts({ isActive: true }),
      getArticles({ isPublished: true }),
      getVideos({ isActive: true }),
      getSpareparts({ isActive: true }),
    ])
      .then(([products, articles, videos, spareparts]) => {
        cache = { products, articles, videos, spareparts };
        if (active) {
          setData(cache);
          setLoaded(true);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [enabled]);

  return { ...data, loaded };
}
