import { MetadataRoute } from "next";
import { getProducts } from "@/lib/firestore/products";
import { getPublishedArticles } from "@/lib/firestore/articles";
import { getSpareparts } from "@/lib/firestore/spareparts";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mesineskristal.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/sparepart`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/produk`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/artikel`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/video`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/galeri`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/tentang`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/kontak`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  let articlePages: MetadataRoute.Sitemap = [];
  let sparepartPages: MetadataRoute.Sitemap = [];

  try {
    const products = await getProducts({ isActive: true });
    productPages = products.map((product) => ({
      url: `${baseUrl}/produk/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const articles = await getPublishedArticles();
    articlePages = articles.map((article) => ({
      url: `${baseUrl}/artikel/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const spareparts = await getSpareparts({ isActive: true });
    sparepartPages = spareparts.map((sparepart) => ({
      url: `${baseUrl}/sparepart/${sparepart.slug}`,
      lastModified: sparepart.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // If Firebase is not configured yet, return only static pages
  }

  return [...staticPages, ...productPages, ...sparepartPages, ...articlePages];
}
