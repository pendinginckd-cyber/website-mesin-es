"use client";

import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { getFeaturedTestimonials } from "@/lib/firestore/testimonials";
import { getApprovedReviews } from "@/lib/firestore/reviews";
import { Testimonial } from "@/types/testimonial";
import { Review } from "@/types/review";

interface TestimoniReviewSectionProps {
  title?: string;
  testimonialsLimit?: number;
  reviewLimit?: number;
}

export function TestimoniReviewSection({
  title = "Ulasan Pelanggan",
  testimonialsLimit = 4,
  reviewLimit = 4,
}: TestimoniReviewSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tData, rData] = await Promise.all([
          getFeaturedTestimonials(testimonialsLimit),
          getApprovedReviews(reviewLimit),
        ]);
        setTestimonials(tData);
        setReviews(rData);
      } catch (error) {
        console.error("Error fetching testimonials/reviews:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, [testimonialsLimit, reviewLimit]);

  if (loading) return null;
  if (testimonials.length === 0 && reviews.length === 0) return null;

  const allItems = [
    ...testimonials.map((t) => ({ ...t, type: "testimonial" } as const)),
    ...reviews.map((r) => ({ ...r, type: "review" } as const)),
  ].sort((a, b) => {
    const aTime =
      a.type === "testimonial"
        ? (a as Testimonial).createdAt?.getTime() || 0
        : (a as Review).submittedAt?.getTime() || 0;
    const bTime =
      b.type === "testimonial"
        ? (b as Testimonial).createdAt?.getTime() || 0
        : (b as Review).submittedAt?.getTime() || 0;
    return bTime - aTime;
  });

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dengarkan langsung dari pelanggan yang sudah merasakan manfaat mesin
            es kristal kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allItems.map((item) => {
            if (item.type === "testimonial") {
              const t = item as Testimonial;
              return (
                <div
                  key={t.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />

                  <p className="text-gray-700 mb-4 line-clamp-4 italic">
                    &ldquo;{t.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < t.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt={t.customerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {t.customerName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {t.customerName}
                      </p>
                      {t.location && (
                        <p className="text-xs text-gray-500">{t.location}</p>
                      )}
                    </div>
                  </div>

                  {t.productUsed && (
                    <p className="text-xs text-gray-500 mt-2">
                      Produk: {t.productUsed}
                    </p>
                  )}
                </div>
              );
            }

            if (item.type === "review") {
              const r = item as Review;
              return (
                <div
                  key={r.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />

                  <p className="text-gray-700 mb-4 line-clamp-4 italic">
                    &ldquo;{r.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < r.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {r.photo ? (
                      <img
                        src={r.photo}
                        alt={r.customerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {r.customerName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {r.customerName}
                      </p>
                      {r.customerPhone && (
                        <p className="text-xs text-gray-500">Telepon: {r.customerPhone}</p>
                      )}
                    </div>
                  </div>

                  {r.productUsed && (
                    <p className="text-xs text-gray-500 mt-2">
                      Produk: {r.productUsed}
                    </p>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </section>
  );
}