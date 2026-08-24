"use client";

import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { getApprovedReviews } from "@/lib/firestore/reviews";
import { Review } from "@/types/review";

interface ReviewSectionProps {
  title?: string;
  limit?: number;
}

export function ReviewSection({ title = "Ulasan Pelanggan", limit = 6 }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getApprovedReviews(limit);
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, [limit]);

  if (loading) return null;
  if (reviews.length === 0) return null;

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
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />

              <p className="text-gray-700 mb-4 line-clamp-4 italic">
                &ldquo;{review.content}&rdquo;
              </p>

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                {review.photo ? (
                  <img
                    src={review.photo}
                    alt={review.customerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {review.customerName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {review.customerName}
                  </p>
                  {review.customerPhone && (
                    <p className="text-xs text-gray-500">Telepon: {review.customerPhone}</p>
                  )}
                </div>
              </div>

              {review.productUsed && (
                <p className="text-xs text-gray-500 mt-2">
                  Produk: {review.productUsed}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}