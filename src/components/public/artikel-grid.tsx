import Link from "next/link";
import { ArtikelCard } from "@/components/public/artikel-card";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Article } from "@/types/article";

interface ArtikelGridProps {
  articles: Article[];
  loading?: boolean;
  title?: string;
  showViewAll?: boolean;
}

export function ArtikelGrid({ articles, loading = false, title, showViewAll = false }: ArtikelGridProps) {
  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Belum ada artikel.</p>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArtikelCard key={article.id} article={article} />
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-10">
            <Link
              href="/artikel"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              Lihat Semua Artikel
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
