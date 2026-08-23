import Link from "next/link";
import { ProdukCard } from "@/components/public/produk-card";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/product";

interface ProdukGridProps {
  products: Product[];
  loading?: boolean;
  title?: string;
  showViewAll?: boolean;
}

export function ProdukGrid({ products, loading = false, title, showViewAll = false }: ProdukGridProps) {
  if (loading) {
    return (
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProdukCard key={product.slug} product={product} />
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-10">
            <Link
              href="/produk"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              Lihat Semua Produk
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
