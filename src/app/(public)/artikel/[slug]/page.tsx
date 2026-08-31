import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ArtikelCard } from "@/components/public/artikel-card";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { ShareButton } from "@/components/shared/share-button";
import { getArticleBySlug, getArticles } from "@/lib/firestore/articles";
import { getRelatedFaqs } from "@/lib/firestore/faqs";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  return {
    title: `${article.title} | ${SITE_NAME}`,
    description: article.excerpt,
    alternates: {
      canonical: `${SITE_URL}/artikel/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage, width: 1200, height: 630 }],
      url: `${SITE_URL}/artikel/${slug}`,
    },
  };
}

export default async function ArtikelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.isPublished) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Artikel Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Artikel yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            ← Kembali ke Artikel
          </Link>
        </div>
      </div>
    );
  }

  const allArticles = await getArticles({ isPublished: true });
  const relatedArticles = allArticles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  const relatedFaqs = await getRelatedFaqs(
    [article.title, article.category, ...(article.tags ?? [])],
    5
  );

  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(article.publishedAt)
    : "";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb
          items={[
            { label: "Artikel", href: "/artikel" },
            { label: article.title },
          ]}
        />

        {article.coverImage && (
          <div className="aspect-video rounded-xl overflow-hidden mb-8">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {article.category}
            </span>
            {formattedDate && (
              <span className="text-sm text-gray-500">{formattedDate}</span>
            )}
            <div className="ml-auto">
              <ShareButton title={article.title} text={article.excerpt} />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {article.title}
          </h1>
          <p className="text-sm text-gray-500">Oleh {article.author}</p>
        </div>

        {article.content && (
          <div
            className="prose prose-gray max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {relatedFaqs.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              FAQ Terkait
            </h2>
            <FaqAccordion faqs={relatedFaqs} />
            <Link
              href="/faq"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              Lihat semua FAQ
            </Link>
          </div>
        )}

        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Artikel Terkait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArtikelCard key={related.id} article={related} variant="compact" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
